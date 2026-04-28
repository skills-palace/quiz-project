import Link from "next/link";
import { FC } from "react";
import { IconType } from "react-icons";
import cn from "classnames";

interface IProps {
  title: string;
  url: string;
  pathname: string;
  Icon: IconType;
}

const NavItem: FC<IProps> = ({ title, url, pathname, Icon }) => {
  const isActive = url === pathname;
  return (
    <li>
      <Link
        href={url}
        className={cn(
          "flex items-center p-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100",
          { "bg-gray-100": isActive }
        )}
      >
        <Icon className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" />
        <span className="ml-2">{title}</span>
      </Link>
    </li>
  );
};

export default NavItem;
