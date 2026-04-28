import React from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

const Item = ({ item, answer }) => {
  

  const quizTitleDirection = detectDirection(item.title);
  return (
    <div className="question">
      <div className="q_left">
        <Text direction={quizTitleDirection}>{item.title}</Text>
      </div>

      <div className="q_middle">
        <input
          type="radio"
          checked={item.answer}
          onChange={() => answer(item.id, true)}
        />
      </div>
      <div className="q_right">
        <input
          type="radio"
          checked={item.isAnswer && !item.answer}
          onChange={() => answer(item.id, false)}
        />
      </div>
    </div>
  );
};

export default Item;
