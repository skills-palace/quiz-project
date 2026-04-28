import React from "react";

const BtnBlue = ({
  className = "font-medium rounded-lg text-sm px-5 py-2.5 text-center",
  children,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default BtnBlue;
