import React from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

const Item = ({ item, answer }) => {
  
  const quizTitleDirection = detectDirection(item.title);
  return (
    <div className="flex items-center justify-between bg-blue-100 p-2 pl-10 pr-10">
      <Text direction={quizTitleDirection} >{item.title}</Text>
      <p className="mx-2 font-semibold"> = </p>
      <input
        className="w-20 bg-gray-60 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        onBlur={(e) => answer(item.id, parseInt(e.target.value))}
        type="text"
      />
    </div>
  );
};

export default Item;
