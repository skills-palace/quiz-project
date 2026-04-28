import React from "react";

const BtnRed = ({
  children,
  className = "text-sm px-5 py-2.5 rounded-lg",
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`bg-red-600 hover:bg-red-500 border active:bg-red-700 text-white  ${className}`}
    >
      {children}
    </button>
  );
};

export default BtnRed;
