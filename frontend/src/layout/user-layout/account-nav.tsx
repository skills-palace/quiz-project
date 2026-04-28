import Link from "next/link";
import { useRouter } from "next/router";
import {
  BiBarChartSquare,
  BiUser,
  BiShoppingBag,
  BiHeart,
  BiTestTube,
} from "react-icons/bi";
import NavItem from "./nav-item";
import LogoutButton from "../dashboard/header/logout-btn";

type Option = {
  name: string;
  slug: string;
  // icon?: JSX.Element;
  icon?: string;
};

export default function AccountNav({ options }: { options: Option[] }) {
  const { pathname } = useRouter();

  return (
    <div className="max-w-2xl mx-auto border border-border-base rounded-md overflow-hidden bg-white shadow-md">
      <aside className="w-64">
        <div className="px-3 py-4 overflow-y-auto rounded">
          <p className="text-sm text-gray-400 mb-2">Dashboard</p>
          <ul className="space-y-1">
            <NavItem
              title="Profile"
              url="/my-account"
              pathname={pathname}
              Icon={BiUser}
            />
            <NavItem
              title="Lessons"
              url="/my-account/lesson"
              pathname={pathname}
              Icon={BiShoppingBag}
            />
            <NavItem
              title="Wishlist"
              url="/my-account/wishlist"
              pathname={pathname}
              Icon={BiHeart}
            />
            <NavItem
              title="My Teachers"
              url="/my-account/wishlist"
              pathname={pathname}
              Icon={BiTestTube}
            />
          </ul>
          <button className="mt-4 px-3 py-2 bg-blue-400 hover:bg-blue-500 transition-all rounded w-full text-white">
             <LogoutButton />
          </button>
        </div>
      </aside>
    </div>
  );
}
