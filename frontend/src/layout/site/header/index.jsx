import React, { useEffect, useRef, useState, useMemo } from "react";
import { BiUserCircle, BiSearch } from "react-icons/bi";
import Menu from "./menu";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import _truncate from "lodash/truncate";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import useLogout from "@/auth/useLogout";
import { clearAuth, setAuth } from "@/redux/slices/app-slice";

const Header = () => {
  const auth = useSelector(({ app }) => app.auth);
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const routerRef = useRef(router);
  routerRef.current = router;

  useEffect(() => {
    if (!router.isReady) return;
    const raw = router.query.title;
    const fromUrl = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";
    setSearchValue(fromUrl);
  }, [router.isReady, router.query.title]);

  const debouncedNavigate = useMemo(
    () =>
      debounce((value) => {
        const r = routerRef.current;
        const trimmed = (value || "").trim();
        if (r.pathname === "/") {
          const nextQuery = { ...r.query };
          if (trimmed) nextQuery.title = trimmed;
          else delete nextQuery.title;
          r.push({ pathname: "/", query: nextQuery }, undefined, {
            shallow: true,
          });
        } else {
          r.push(
            trimmed
              ? { pathname: "/", query: { title: trimmed } }
              : { pathname: "/" }
          );
        }
      }, 400),
    []
  );

  useEffect(() => () => debouncedNavigate.cancel(), [debouncedNavigate]);

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Logout logic
  const LogoutButton = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [logout, { isLoading, isSuccess, isError, error }] = useLogout();

    useEffect(() => {
      if (isSuccess) {
        dispatch(setAuth({ status: "noAuth", user: {} }));
        localStorage.removeItem("auth");
        dispatch(clearAuth());

        toast.success("Logged out successfully");
        window.location.href = "/";
      }

      if (isError) {
        toast.error("Something went wrong. Please try again.");
        console.error("Logout error:", error);
      }
    }, [isSuccess, isError, dispatch, router]);

    return (
      <button
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={logout}
        disabled={isLoading}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    );
  };

  return (
    <header className="shadow-lg">
      <div className="bg-blue-600 py-2">
    <div className="header-bar-safe container mx-auto px-3 sm:px-4 max-w-7xl min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 min-w-0">
            {/* Search lessons by name (/?title=...) */}
            <form
              className="flex items-center min-w-0 flex-1 max-w-md basis-full sm:basis-0"
              onSubmit={(e) => {
                e.preventDefault();
                debouncedNavigate.flush();
                const trimmed = searchValue.trim();
                const r = routerRef.current;
                if (r.pathname === "/") {
                  const nextQuery = { ...r.query };
                  if (trimmed) nextQuery.title = trimmed;
                  else delete nextQuery.title;
                  r.push({ pathname: "/", query: nextQuery }, undefined, {
                    shallow: true,
                  });
                } else {
                  r.push(
                    trimmed
                      ? { pathname: "/", query: { title: trimmed } }
                      : { pathname: "/" }
                  );
                }
              }}
            >
              <label htmlFor="site-lesson-search" className="sr-only">
                Search lessons by name
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BiSearch className="w-5 h-5 text-gray-500" />
                </div>
                <input
                  type="search"
                  id="site-lesson-search"
                  value={searchValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSearchValue(v);
                    debouncedNavigate(v);
                  }}
                  autoComplete="off"
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2"
                  placeholder="Search lessons by name"
                />
              </div>
            </form>

            {/* User Authentication Section */}
            <div className="flex items-center gap-2 sm:gap-4 text-white shrink-0 min-w-0">
              {auth.status === "idle" ? (
                "Loading..."
              ) : auth.status === "auth" ? (
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex items-center cursor-pointer rounded-full px-4 py-2 bg-blue-700 hover:bg-blue-800 transition"
                    onClick={toggleDropdown}
                  >
                    <BiUserCircle className="w-6 h-6" />
                    <p className="ml-2 text-sm font-medium">
                      {_truncate(auth.user.username, { length: 10 })}
                    </p>
                  </div>
                  {dropdownVisible && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10">
                      <Link href="/my-account">
                        <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                          My Account
                        </p>
                      </Link>
                      <LogoutButton />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link href="/login">
                    <p className="text-xs font-medium bg-blue-500 px-2 py-2 rounded-full hover:bg-blue-600 transition">Sign In</p>
                  </Link>
                  <Link href="/register">
                    <p className="text-xs  font-medium bg-blue-500 px-2 py-2 rounded-full hover:bg-blue-600 transition">Sign Up</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Menu />
    </header>
  );
};

export default Header;
