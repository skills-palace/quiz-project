import React from "react";

const Label = ({
  title,
  className = "w-full py-3 ml-2 text-sm font-medium text-gray-900",
  ...rest
}) => {
  return (
    <label {...rest} className={className}>
      {title}
    </label>
  );
};

export default Label;
