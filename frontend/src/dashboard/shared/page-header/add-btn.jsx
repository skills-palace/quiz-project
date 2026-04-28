import React from "react";
import { BiPlusCircle } from "react-icons/bi";

const AddBtn = ({ title, ...props }) => {
  return (
    <button
      {...props}
      className="rounded-lg font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white radius-round h-9 px-3 py-2 text-sm w-full"
    >
      <span className="flex items-center justify-center">
        <BiPlusCircle className="w-5 h-5 mr-1 text-white" />
        <span>{title}</span>
      </span>
    </button>
  );
};

export default AddBtn;
