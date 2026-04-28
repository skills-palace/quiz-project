import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

const MenuItem = ({ src, title }) => {
  return (
    <li>
      <Link href={src} className="text-[16px] font-sans font-bold text-blue-600 md:text-sm lg:text-md xl:text-lg">
        {title}
      </Link>
    </li>
  );
};

export default MenuItem;
