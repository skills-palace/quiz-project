import React from "react";

const Radio = (props) => {
  return (
    <input
      {...props}
      type="radio"
      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
    />
  );
};

export default Radio;
