import React, { useEffect, useState } from "react";
import adminSidebarMenu from "@/config/admin-sidebar-menu";
import teacherSidebarMenu from "@/config/teacher-sidebar-menu";
import MenuGroup from "./menu-group";
import Image from "next/image";
import { BiMenuAltLeft } from "react-icons/bi";
import { useRouter } from "next/router";

const SideBar = ({ isOpen, toggleSidebar }) => {
  const [activeDepth, setActiveDepth] = useState([""]);
  const [sidebarMenu, setSidebarMenu] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (router.pathname.startsWith('/admin')) {
      setSidebarMenu(adminSidebarMenu);
    } else if (router.pathname.startsWith('/teacher')) {
      setSidebarMenu(teacherSidebarMenu);
    }
  }, [router.pathname]);

  const handleclcik = (depth, label) => {
    setActiveDepth((state) => {
      let newSelectedMenus = [...state];
      if (newSelectedMenus[depth] === label) {
        console.log("active depth");
        //newSelectedMenus[depth];
        //newSelectedMenus[depth] = ''
        newSelectedMenus.splice(depth, 1);
        return newSelectedMenus;
      }
      newSelectedMenus.length = depth;
      newSelectedMenus[depth] = label;
      return newSelectedMenus;
    });
  };

  useEffect(() => {
    const findPath = (children, targetId) => {
      const path = [];
      (function search(children) {
        return children?.some((child) => {
          path.push(child.link);

          if (child.link === targetId || search(child.children)) {
            return true;
          }

          path.pop();
        });
      })(children);

      return path;
    };

    let path = findPath(
      sidebarMenu.reduce((acc, item) => [...acc, ...item.groupMenu], []),
      router.pathname
    );

    setActiveDepth(path);
  }, [router.pathname, sidebarMenu]);

  return (
    <div
      className={`bg-white border-r shadow-md absolute z-[999] w-[180px] md:w-[250px] transition-all duration-300 md:static ${
        isOpen ? "-left-0" : "-left-[250px]"
      } `}
      //style={{ width: "250px", minWidth: "250px" }}
    >
      <div className="border-b mb-2 flex justify-between items-center h-12">
        <div className="p-2 h-full flex flex-col justify-center items-center">
          <Image
            src={"/icons/skills_logo_4.png"}
            alt="logo"
            width={140}
            height={140}
          />
        </div>
        <div onClick={toggleSidebar} className="text-2xl md:hidden">
          <BiMenuAltLeft />
        </div>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)] mt-3">
        <div
        //style="position: relative; overflow: hidden; width: 100%; height: 100%;"
        >
          <div
          //  style="position: absolute; inset: 0px; overflow: scroll; margin-right: -17px; margin-bottom: -17px;"
          >
            <nav className="menu menu-light px-4 pb-4">
              {sidebarMenu.map((group) => (
                <MenuGroup
                  setActive={handleclcik}
                  key={group.groupId}
                  group={group}
                  depth={0}
                  activeDepth={activeDepth}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
