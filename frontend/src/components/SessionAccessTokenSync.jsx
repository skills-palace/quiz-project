import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Cookies from "js-cookie";
import { resetExplorerTrialBannerVisibility } from "@/lib/explorer-trial-session";

/**
 * Keeps js-cookie access_token / refresh_token in sync with NextAuth JWT so API
 * calls (axiosApi) work on every page, not only after the login form effect runs.
 * When the user moves from signed-out to signed-in, clears “hide banner” so the
 * Explorer trial strip shows again after each login.
 */
export default function SessionAccessTokenSync() {
  const { data: session, status } = useSession();
  const prevStatusRef = useRef(null);

  useEffect(() => {
    const prev = prevStatusRef.current;
    if (prev === "unauthenticated" && status === "authenticated") {
      resetExplorerTrialBannerVisibility();
    }
    prevStatusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const u = session.user;
    const at = u.accessToken;
    const rt = u.refreshToken;
    if (at && Cookies.get("access_token") !== at) {
      Cookies.set("access_token", at, { expires: 1 });
    }
    if (rt && Cookies.get("refresh_token") !== rt) {
      Cookies.set("refresh_token", rt, { expires: 30 });
    }
  }, [status, session]);

  return null;
}
