import { BiChevronDown } from "react-icons/bi";
import SubMenu from "./sub-menu";

const GroupItem = ({ menu, setActive, depth, isActive }) => {
  return (
    <div key={menu.title} className="mb-2">
      <div
        //onClick={() => setac((prev) => !prev)}
        onClick={() => setActive(depth, menu.link)}
        className={`flex items-center px-2 py-2.5 font-medium text-sm text-slate-600 rounded-lg ransition-all hover:bg-gray-200 cursor-pointer ${
          isActive ? "bg-gray-200" : ""
        }`}
      >
        <span className="text-2xl mr-2">
          <menu.Icon className="w-6 h-6 transition duration-75 dark:text-gray-400 group-hover:text-gray-500" />
        </span>
        <span className="font-semibold">{menu.title}</span>
        <span
          className="text-lg ml-auto"
          // style="transform: rotate(0deg);"
        >
          <BiChevronDown />
        </span>
      </div>
      <SubMenu isOpen={isActive} subMenu={menu.children} depth={depth + 1} />
    </div>
  );
};

export default GroupItem;
