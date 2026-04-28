import { useState, useEffect } from "react";
import Alert from "@/ui/alert";
import cn from "classnames";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

const Math = ({ quiz, idx }) => {
  const quizTitleDirection = detectDirection(quiz.title);
  return (
    <div className="mb-4 bg-sky-100 shadow-md p-2 rounded">
      <Text
        direction={quizTitleDirection}
        className={`${quizTitleDirection==='rtl'? "text-[20px] font-naskh font-bold":
          "text-[20px] font-sans"}`}>
       
      {`${idx + 1}. ${quiz.title}`}</Text>

      <div className="mb-2">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {quiz.quiz_items.map((item, j) => {
            const aDir = detectDirection(String(item.title ?? "") + String(item.answer ?? ""));
            return (
              <div key={j} className="flex flex-col gap-1 rounded-md border border-slate-200 bg-white/80 p-2">
                <div className="flex items-center">
                  <Text direction={aDir} className="font-semibold text-slate-800">
                    {item.title}
                  </Text>
                  <p className="mx-2">=</p>
                  <Text
                    direction={aDir}
                    className={cn("rounded border py-1 px-3 text-white", {
                    "bg-red-400": item.status === 0,
                    "bg-green-600": item.status === 1,
                    "bg-blue-400": item.status === 2,
                    })}
                  >
                    {String(item.answer)}
                  </Text>
                </div>
                {item.correctValue !== undefined && item.correctValue !== null && item.status === 0 && (
                  <p className={`text-xs font-bold text-emerald-800 ${aDir === "rtl" ? "font-naskh" : "font-sans"}`}>
                    {aDir === "rtl" ? "الصحيح: " : "Correct: "}
                    {String(item.correctValue)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Math;
