import React from "react";

const Label = ({ children, className = "mb-2", ...rest }) => {
  return (
    <label {...rest} className={`input-label ${className}`}>
      {children}
    </label>
  );
};

export default Label;
