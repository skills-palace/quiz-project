import React from "react";

const BtnRed = ({ children, className = "px-3 py-2", ...rest }) => {
  return (
    <button
      {...rest}
      className={`bg-red-600 hover:bg-red-500 border active:bg-red-700 text-white rounded h-9 text-sm ${className}`}
    >
      {children}
    </button>
  );
};

export default BtnRed;
