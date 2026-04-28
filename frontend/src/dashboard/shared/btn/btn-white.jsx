import React from "react";

const BtnRed = ({ children, className = "px-3 py-2", ...rest }) => {
  return (
    <button
      {...rest}
      className={`bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-600 rounded h-9 text-sm ${className}`}
    >
      {children}
    </button>
  );
};

export default BtnRed;
