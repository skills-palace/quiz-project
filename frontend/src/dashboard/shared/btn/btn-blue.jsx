import React from "react";

const BtnPrimary = ({
  className = "rounded-2xl px-10 py-3 min-h-[3rem] text-center font-sans font-bold inline-flex items-center justify-center",
  children,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={`rounded-2xl px-10 text-white mt-2 text-[18px] font-sans font-medium bg-blue-600 hover:bg-blue-700 border transition active:scale-[0.98] ${className}`}

    >
      {children}
    </button>
  );
};

export default BtnPrimary;
