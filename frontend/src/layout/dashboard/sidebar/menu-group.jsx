import React, { useState } from "react";
import Link from "next/link";
import { BiArchive, BiChevronDown } from "react-icons/bi";
import SubMenu from "./sub-menu";
import MenuItem from "./menu-item";
import GroupItem from "./group-item";

const MenuGroup = ({ group, setActive, depth, activeDepth }) => {
  return (
    <div className="my-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-700 mb-2">
        {group.groupTitle}
      </div>
      <ul>
        {group.groupMenu.map((menu) => {
          const isActive = activeDepth[depth] === menu.link;
          return menu.children ? (
            <GroupItem
              key={menu.link}
              menu={menu}
              setActive={setActive}
              depth={depth}
              isActive={isActive}
              activeDepth={activeDepth}
            />
          ) : (
            <MenuItem
              key={menu.link}
              menu={menu}
              isActive={isActive}
              setActive={() => setActive(depth, menu.link)}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default MenuGroup;
