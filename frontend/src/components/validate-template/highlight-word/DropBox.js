import useFitText from "@/hooks/useFitText";
import cn from "classnames";
import React from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

function DropBox({ item }) {
  //const { textRef } = useFitText();
  const quizTitleDirection = detectDirection(item.title);
  return (
    <div className="border-2 transition-all border-gray-200 min-h-[30px] p-1 inline-block mt-3 -mb-2 mx-2">
      <p
        direction={quizTitleDirection}
        // ref={textRef}

        className={cn(
          "text-center w-full text-white rounded mr-0 inline-block p-1",
          {
            "bg-red-400": item.status === 0,
            "bg-green-600": item.status === 1,
            "bg-blue-400": item.status === 2,
          }
        )}
      >
        {item.title}
      </p>
      {item.expectedTitle != null && item.status === 0 && (
        <p
          className={`mt-0.5 text-center text-[11px] font-bold text-emerald-800 ${
            quizTitleDirection === "rtl" ? "font-naskh" : "font-sans"
          }`}
        >
          {quizTitleDirection === "rtl" ? "الصحيح: " : "Correct: "}
          {item.expectedTitle}
        </p>
      )}
    </div>
  );
}

export default DropBox;
