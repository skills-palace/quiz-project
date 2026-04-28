import React from "react";

const Select = ({ register, children, className, ...rest }) => {
  return (
    <select
      {...register}
      {...rest}
      className={["input-select", className].filter(Boolean).join(" ")}
    >
      {children}
    </select>
  );
};

export default Select;
