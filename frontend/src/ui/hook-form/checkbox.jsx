import React from "react";

const CheckBox = ({ register, error, ...rest }) => {
  return (
    <input
      {...register}
      {...rest}
      type="checkbox"
      className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 "
    />
  );
};

export default CheckBox;
