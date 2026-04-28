import React, { useMemo } from "react";
import cn from "classnames";
import { Text } from "@/components/StyledComponents";
import {
  detectDirection,
  layoutDirectionForSequencedQuiz,
} from "@/utils/detectDirection";
import CorrectAnswerStrip from "../CorrectAnswerStrip";

const Rearrange = ({ quiz, idx }) => {
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
            ? "mb-1 text-[20px] font-naskh font-bold"
            : " mb-1 text-[20px] font-sans "
        }`}
      >
        {`${idx + 1}. ${quiz.title}`}
      </Text>

      <CorrectAnswerStrip titleText={quiz.title} review={quiz.review} />

      <p
        className={`mb-1 mt-2 text-xs font-semibold tracking-wide text-slate-600 ${
          isRtl
            ? "font-naskh normal-case"
            : "font-sans uppercase"
        }`}
      >
        {isRtl ? "إجابتك (حسب الموضع)" : "Your answer (by position)"}
      </p>
      <div className="flex flex-wrap gap-1" dir={layoutDir}>
        {quiz.quiz_items.map((item, i) => {
          const itemDir = detectDirection(item.title);
          return (
            <div key={i} className="mx-1 flex flex-col items-center gap-0.5">
            <Text
              direction={itemDir}
              className={cn(
                "py-1 px-2 rounded text-[20px] font-semibold text-white",
                isRtl || itemDir === "rtl" ? "font-naskh" : "font-sans",
                {
                "bg-blue-400": item.status === 0,
                "bg-green-600": item.status === 1,
                "bg-red-400": item.status === 2,
                }
              )}
            >
              {item.title ?? "—"}
            </Text>
            {item.expectedTitle != null && item.status !== 1 && (
              <span className={`max-w-[12rem] text-center text-[11px] font-medium text-emerald-800 ${isRtl ? "font-naskh" : "font-sans"}`}>
                {isRtl ? "المتوقع: " : "Expected: "}
                {item.expectedTitle}
              </span>
            )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rearrange;
