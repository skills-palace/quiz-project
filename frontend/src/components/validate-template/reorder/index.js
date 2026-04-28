import React, { useMemo } from "react";
import cn from "classnames";
import { Text } from "@/components/StyledComponents";
import { detectDirection, layoutDirectionForSequencedQuiz } from "@/utils/detectDirection";
import CorrectAnswerStrip from "../CorrectAnswerStrip";

const Reorder = ({ quiz, idx }) => {
  const layoutDir = useMemo(
    () =>
      layoutDirectionForSequencedQuiz({
        title: quiz.title,
        quizes: (quiz.quiz_items || []).map((it, i) => ({
          id: `r-${i}`,
          title: it?.title,
        })),
      }),
    [quiz.title, quiz.quiz_items]
  );
  const isRtl = layoutDir === "rtl";
  return (
    <div
      dir={layoutDir}
      className={`mb-4 rounded bg-sky-100 p-2 shadow-md ${
        isRtl ? "text-right font-naskh" : "text-left font-sans"
      }`}
    >
      <Text
        direction={layoutDir}
        className={`${
          isRtl
            ? "text-[20px] font-naskh font-bold"
            : "text-[20px] font-sans font-semibold"
        }`}
      >
        {`${idx + 1}. ${quiz.title}`}
      </Text>
      <CorrectAnswerStrip titleText={quiz.title} review={quiz.review} />
      <p
        className={`mb-1 mt-2 text-xs font-semibold tracking-wide text-slate-600 ${
          isRtl ? "font-naskh normal-case" : "font-sans uppercase"
        }`}
      >
        {isRtl ? "إجابتك" : "Your order"}
      </p>
      <div className="" dir={layoutDir}>
        {quiz.quiz_items.map((item, i) => {
          const itemDir = detectDirection(item.title);
          return (
            <div key={i} className="my-2 flex flex-col gap-0.5">
            <Text
              direction={itemDir}
              className={cn(
                "rounded bg-gray-100 py-1 px-2 text-white text-[18px]",
                isRtl || itemDir === "rtl" ? "font-naskh" : "font-sans",
                {
              "bg-blue-400": item.status === 0,
              "bg-green-600": item.status === 1,
              "bg-red-400": item.status === 2,
            })}
          >
            {item.title ?? "—"}
          </Text>
          {item.expectedTitle != null && item.status !== 1 && (
              <span className={`text-[11px] font-medium text-emerald-800 ${isRtl ? "font-naskh" : "font-sans"}`}>
                {isRtl ? "المتوقع: " : "Expected: "}{item.expectedTitle}
              </span>
          )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reorder;
