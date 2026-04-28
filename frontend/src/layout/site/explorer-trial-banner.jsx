import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession, getSession } from "next-auth/react";
import Cookies from "js-cookie";
import axiosApi from "@/lib/axiosApi";
import {
  EXPLORER_TRIAL_BANNER_HIDE_KEY,
} from "@/lib/explorer-trial-session";

function formatRemaining(endsAt) {
  const ms = endsAt.getTime() - Date.now();
  if (ms <= 0) return "0m";
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Active trial: countdown + upgrade links.
 * Expired Explorer: persistent notice; quiz submit is blocked until Learner upgrade.
 */
const ExplorerTrialBanner = () => {
  const { status } = useSession();
  const [banner, setBanner] = useState(null);
  const [tick, setTick] = useState(0);
  const [hidden, setHidden] = useState(false);

  const readDismissedFromStorage = useCallback(() => {
    if (typeof window === "undefined") return false;
    try {
      return Boolean(sessionStorage.getItem(EXPLORER_TRIAL_BANNER_HIDE_KEY));
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    setHidden(readDismissedFromStorage());
  }, [readDismissedFromStorage]);

  useEffect(() => {
    const onReset = () => setHidden(false);
    if (typeof window !== "undefined") {
      window.addEventListener("sp-explorer-trial-banner-reset", onReset);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("sp-explorer-trial-banner-reset", onReset);
      }
    };
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!readDismissedFromStorage()) {
      setHidden(false);
    }
  }, [status, readDismissedFromStorage]);

  const load = useCallback(async () => {
    let token = Cookies.get("access_token");
    if (!token && status === "authenticated") {
      const session = await getSession();
      token = session?.user?.accessToken ?? null;
      if (token) {
        Cookies.set("access_token", token, { expires: 1 });
        const rt = session?.user?.refreshToken;
        if (rt) Cookies.set("refresh_token", rt, { expires: 30 });
      }
    }
    if (!token) {
      setBanner(null);
      return;
    }
    try {
      const { data } = await axiosApi.get("/user/me");
      const u = data?.result;
      if (!u) {
        setBanner(null);
        return;
      }
      const plan = u.subscriptionPlan ?? "explorer";
      if (plan !== "explorer") {
        setBanner(null);
        return;
      }
      const raw = u.explorerTrialEndsAt;
      if (!raw) {
        setBanner(null);
        return;
      }
      const end = new Date(raw);
      if (end.getTime() <= Date.now()) {
        setBanner({ kind: "expired" });
        return;
      }
      setBanner({ kind: "active", endsAt: end });
    } catch {
      setBanner(null);
    }
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setBanner(null);
      return;
    }
    load();
  }, [status, load]);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!banner || banner.kind !== "active" || !banner.endsAt) return;
    if (banner.endsAt.getTime() <= Date.now()) {
      setBanner({ kind: "expired" });
    }
  }, [banner, tick]);

  const remaining = useMemo(() => {
    if (!banner || banner.kind !== "active" || !banner.endsAt) return "";
    return formatRemaining(banner.endsAt);
  }, [banner, tick]);

  if (hidden || !banner) return null;

  if (banner.kind === "expired") {
    return (
      <div
        className="w-full border-b border-rose-200 bg-gradient-to-r from-rose-50 via-rose-100/85 to-rose-50 text-rose-950 shadow-sm"
        role="alert"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-3.5 relative pr-10 sm:pr-12">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <div className="flex-1 min-w-0 text-center sm:text-left font-sans">
              <p className="font-semibold text-sm sm:text-base text-rose-950 leading-relaxed">
                Your Explorer free trial has ended.
              </p>
              <p className="text-xs sm:text-sm text-rose-900/90 mt-1">
                You can still browse lessons, but submitting quizzes and saving results requires a{" "}
                <strong>Learner</strong> plan. Upgrade to continue full access.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 shrink-0">
              <Link
                href="/contact-us"
                className="inline-flex items-center rounded-md bg-rose-800 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-rose-900 font-sans"
              >
                Upgrade
              </Link>
              <Link
                href="/membership"
                className="text-xs font-medium text-rose-900 underline decoration-rose-400 underline-offset-2 hover:text-rose-950 font-sans"
              >
                View plans
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(EXPLORER_TRIAL_BANNER_HIDE_KEY, "1");
              }
              setHidden(true);
            }}
            className="absolute right-2 top-2 p-1.5 rounded-md text-rose-800/70 hover:text-rose-950 hover:bg-rose-200/60 text-lg leading-none"
            aria-label="Hide banner for this session"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full border-b border-amber-200 bg-gradient-to-r from-amber-50 via-amber-100/80 to-amber-50 text-amber-950 shadow-sm"
      role="status"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-3.5 relative pr-10 sm:pr-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <div className="flex-1 min-w-0 text-center sm:text-left font-sans">
            <p className="font-medium text-sm sm:text-base text-amber-950 leading-relaxed">
              <span className="text-amber-900 font-semibold">Explorer Free</span>
              <span className="text-amber-800/90"> — </span>
              one-week trial. Time left on your access:{" "}
              <strong className="text-amber-950 tabular-nums">{remaining}</strong>
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/contact-us"
              className="inline-flex items-center rounded-md bg-amber-800 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-amber-900 font-sans"
            >
              Upgrade
            </Link>
            <Link
              href="/membership"
              className="text-xs font-medium text-amber-900 underline decoration-amber-400 underline-offset-2 hover:text-amber-950 font-sans"
            >
              View plans
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem(EXPLORER_TRIAL_BANNER_HIDE_KEY, "1");
            }
            setHidden(true);
          }}
          className="absolute right-2 top-2 p-1.5 rounded-md text-amber-800/70 hover:text-amber-950 hover:bg-amber-200/60 text-lg leading-none"
          aria-label="Hide banner for this session"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ExplorerTrialBanner;
