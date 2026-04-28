import DropDown from "@/ui/dropdown";
import Link from "next/link";
import LogoutButton from "./logout-btn";
import { useSelector } from "react-redux";
import _truncate from "lodash/truncate";
import { useEffect } from "react";
import { useRouter } from "next/router";

const UserMenu = () => {
  const auth = useSelector(({ app }) => app.auth);
  const router = useRouter();

  return (
    <DropDown
      renderHeader={(active, toggle) => (
        <div className="cursor-pointer" onClick={toggle}>
          <div className="flex items-center gap-2">
            <img
              className="w-8 h-8 rounded-full"
              src="https://picsum.photos/200/300"
              loading="lazy"
            />
            <div className="hidden md:block">
              <h2 className="text-xs capitalize">admin</h2>
              <p className="text-sm font-bold text-gray-700">
                {auth.status === "idle"
                  ? "loading..."
                  : _truncate(auth.user.username, {
                      length: 10,
                    })}
              </p>
            </div>
          </div>
        </div>
      )}
    >
      <ul className="py-1 text-sm text-gray-700">
        <li>
          <Link
            href={
              router.pathname.startsWith("/teacher") ? "/teacher" : "/admin"
            }
            className="block px-4 py-2 hover:bg-gray-100"
          >
            Teacher
          </Link>
        </li>
      </ul>
      <div className="py-1">
        <LogoutButton />
      </div>
    </DropDown>
  );
};

export default UserMenu;
