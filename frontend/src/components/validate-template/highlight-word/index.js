import { useState } from "react";
import DropBox from "./DropBox";
import Alert from "@/ui/alert";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

const Index = ({ quiz, idx }) => {
  const quizTitleDirection = detectDirection(quiz.title);

  return (
    <div className="mb-4 bg-sky-100 shadow-md p-2 rounded">
      <Text
        direction={quizTitleDirection}
        className={`${
          quizTitleDirection === "rtl"
            ? "text-[20px] font-naskh font-bold"
            : " text-[20px] font-sans font-semibold"
        }`}
      >
        {`${idx + 1}. ${quiz.title}`}
      </Text>
      <div
        className={`${
          quizTitleDirection === "rtl"
            ? "text-[20px] font-naskh"
            : " mb-1 p-1  text-[18px] font-sans"
        }`}
      >
        {quiz.quiz_items.map((n) => {
          const itemDirection = detectDirection(n.title);
          return n.type === "word" || (n.type === "text" && n.status === 0) ? (
            <DropBox key={n.id} item={n} />
          ) : n.type === "newline" ? (
            <div
              key={n.id}
              className="w-full border-b border-gray-300 my-2"
            ></div>
          ) : (
            <span
              direction={itemDirection}
              key={n.id}
              className={`${
                itemDirection === "rtl"
                  ? "inline text-[20px] font-naskh"
                  : "inline text-[18px] font-sans"
              } mx-1`}
            >
              {n.title}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default Index;
