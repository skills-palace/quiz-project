import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

const SubMenu = ({ className = "ml-1", subMenu, isOpen }) => {
  const { pathname } = useRouter();
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        //<div className="">
        <motion.ul
          className={`${className} overflow-hidden`}
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { height: "auto" },
            collapsed: { height: 0 },
          }}
          transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          {subMenu.map((child) => (
            <Link key={child.link} href={`/${child.link}`}>
              <li
                className={` ${
                  child.link === pathname ? "bg-gray-200" : "bg-gray-50"
                } my-1 cursor-pointer border ransition-all border-gray-100 p-1 text-gray-500 rounded-lg hover:bg-gray-200`}
              >
                <div className="text-sm flex space-x-3 items-center transition-all duration-150 text-slate-600 font-medium">
                  <span class="h-2 w-2 rounded-full border border-slate-600 inline-block flex-none"></span>
                  <span className="flex-1">{child.title}</span>
                </div>
              </li>
            </Link>
          ))}
        </motion.ul>
        //</div>
      )}
    </AnimatePresence>
  );
};

export default SubMenu;
