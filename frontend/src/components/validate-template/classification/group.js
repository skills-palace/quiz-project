import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

const Group = ({ group }) => {
  const [direction, setDirection] = useState();

  useEffect(() => {
    group.answers.map((item, idx) => {
      const quizTitleDirection = detectDirection(item.title);
      setDirection(quizTitleDirection);
    });
  }, [group]);
  return (
    <div 
    className="rounded border p-2 min-h-[3.2rem]">
      {group.answers.length > 0
        ? group.answers.map((item, idx) => {
            const quizTitleDirection = detectDirection(item.title);
            return (
              <Text
                direction={quizTitleDirection}
                key={idx}
                className={` ${cn({
                  "bg-red-400 text-white": item.status === 0,
                  "bg-green-600 text-white": item.status === 1,
                  "bg-gray-100 text-black": item.status === 2,
                })} p-1 mb-2 text-white rounded mr-2`}
              >
                {item.title}
              </Text>
            );
          })
        : direction === "rtl"
        ? "لا توجد إجابة "
        : "answer not found"}
    </div>
  );
};

export default Group;
