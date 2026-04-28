import { useState, useEffect } from "react";
import Image from "next/image";
import MenuItem from "./menu-item";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Menu2 = () => {
  const auth = useSelector(({ app }) => app.auth);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    router.events.on("routeChangeComplete", close);
    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <nav
      className="relative z-50 bg-gradient-to-r from-blue-100 to-sky-100 shadow-lg"
      aria-label="Main"
    >
      {menuOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-40 cursor-default bg-slate-900/35 backdrop-blur-[1px] md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div className="relative z-50 container flex flex-wrap items-center justify-between mx-auto px-3 sm:px-4 py-2.5">
        {/* Logo Section */}
        <Link href="/" className="flex items-center">
          <div className="w-40 relative h-12
        ">
            <Image
              fill
              className="object-contain"
              src={"/icons/skills_logo_4.png"}
              alt="skillspalace logo"
            />
          </div>
        </Link>

        {/* Hamburger Button for Mobile */}
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="relative z-50 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-blue-900 md:hidden hover:bg-blue-200/70 active:bg-blue-300/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-100 motion-safe:transition-colors"
          aria-controls="navbar-default"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">
            {menuOpen ? "Close main menu" : "Open main menu"}
          </span>
          {menuOpen ? (
            <svg
              className="h-6 w-6 shrink-0"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6 shrink-0"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>

        {/* Navigation Links */}
        <div
          className={`w-full md:w-auto ${menuOpen ? "block" : "hidden md:block"}`}
          id="navbar-default"
        >
          <ul className="flex flex-col gap-0.5 py-2 md:gap-0 md:py-0 md:flex-row md:space-x-8 md:items-center border-t border-blue-200/60 md:border-t-0 [&_a]:flex [&_a]:min-h-[44px] [&_a]:items-center [&_a]:rounded-lg [&_a]:px-3 [&_a]:py-3 md:[&_a]:min-h-0 md:[&_a]:px-0 md:[&_a]:py-0">
            <MenuItem src="/" title="Home" />
            {auth.status === "auth" && (
              <MenuItem src="/lesson/analysis" title="Analysis" />
            )}
            <MenuItem src="/about" title="About" />
            <MenuItem src="/membership" title="Membership" />
            <MenuItem src="/contact-us" title="Contact Us" />
          </ul>
        </div>
      </div>

      <style jsx>{`
        ul > li > a {
          font-weight: 600;
          font-size: 1rem;
          color: rgb(30 58 138);
          text-transform: uppercase;
          transition: color 0.2s ease, background-color 0.2s ease;
        }
        ul > li > a:hover {
          color: rgb(29 78 216);
          background-color: rgb(191 219 254 / 0.45);
        }
        @media (min-width: 768px) {
          ul > li > a:hover {
            background-color: transparent;
          }
        }
      `}</style>
    </nav>
  );
};

export default Menu2;
