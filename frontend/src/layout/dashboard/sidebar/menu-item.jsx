import Link from "next/link";
import { useRouter } from "next/router";

const MenuItem = ({ menu, setActive }) => {
  const { pathname } = useRouter();
  return (
    <div key={menu.title} onClick={setActive}>
      <Link href={menu.link}>
        <div
          className={` ${
            menu.link === pathname ? "bg-gray-100" : ""
          } flex items-center px-2 transition-all py-2.5 font-medium text-sm text-slate-600 rounded hover:bg-gray-200`}
        >
          <span className="text-2xl mr-3">
            <menu.Icon className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-500" />
          </span>
          <p className="font-semibold">{menu.title}</p>
        </div>
      </Link>
    </div>
  );
};

export default MenuItem;
