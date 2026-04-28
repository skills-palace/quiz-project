import { useState, useRef } from "react";
import { BiArrowBack } from "react-icons/bi";
import cn from "classnames";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
const LineConnect = ({ quiz, idx }) => {
  
  const quizTitleDirection = detectDirection(quiz.title);
  return (
    <div className="mb-4 bg-sky-100 shadow-md p-2 rounded">
      <Text direction={quizTitleDirection} className={`${quizTitleDirection==='rtl'? "text-gray-700 mb-1 text-[20px] font-naskh font-bold":
          "text-gray-700 mb-1 text-[20px] font-sans font-semibold"}`}>
      
        {`${idx + 1}. ${quiz.title}`}
      </Text>

      {quiz.quiz_items.map((item, idx) => {
        const qClass = cn({
          "bg-red-400 text-white": item.status === 0,
          "bg-green-600 text-white": item.status === 1,
          "bg-gray-100 text-black": item.status === 2,
        });
        
  const quizTitleDirection = detectDirection(item.title);
  const quizTitle = detectDirection(item.answer);
        return (
          <div
            key={idx}
            className="mb-3 w-full"
          >
            <div
              className={`${
                quizTitleDirection === "rtl"
                  ? "flex text-[20px] font-naskh"
                  : "flex text-[16px] font-sans"
              }`}
            >
              <Text
                direction={quizTitleDirection}
                className={`${qClass} shadow w-full rounded p-2`}
              >
                {item.title}
              </Text>
              <div
                className={`${qClass} mx-2 flex flex-col items-center justify-center rounded p-2 shadow`}
              >
                <BiArrowBack className="h-5 w-5 rotate-180" />
              </div>
              <Text
                direction={quizTitle}
                className={`${qClass} w-full rounded p-2 shadow`}
              >
                {item.answer}
              </Text>
            </div>
            {item.status !== 1 && item.expectedMatch != null && (
              <div
                className={`mt-1.5 w-full rounded-md border border-emerald-200 bg-emerald-50/90 px-2 py-1.5 text-center text-xs font-bold text-emerald-900 ${
                  quizTitleDirection === "rtl" ? "font-naskh" : "font-sans"
                }`}
              >
                {quizTitleDirection === "rtl"
                  ? "المطابقة الصحيحة: "
                  : "Correct match: "}
                {item.expectedMatch}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LineConnect;
