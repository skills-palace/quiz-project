import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import cn from "classnames";

const ConsonantBlend = ({ quiz, idx }) => {
  const quizTitleDirection = detectDirection(quiz.title);
  return (
    <div
      className="mb-4 bg-cyan-50 shadow-md p-3 rounded"
      dir={quizTitleDirection}
    >
      <Text
        direction={quizTitleDirection}
        className={
          quizTitleDirection === "rtl"
            ? "text-[20px] font-naskh font-bold"
            : "text-[20px] font-sans"
        }
      >{`${idx + 1}. ${quiz.title}`}</Text>
      <div className="mt-2 space-y-2">
        {quiz.quiz_items.map((item, j) => {
          const lineDir = detectDirection(
            `${item.stem || ""}${item.full || ""}${item.correctBlend || ""}${
              item.selected != null ? String(item.selected) : ""
            }`
          );
          const youLabel = lineDir === "rtl" ? "اخترت" : "you:";
          return (
            <div
              key={j}
              className="flex flex-wrap items-center gap-2 text-sm sm:text-base"
              dir={lineDir}
            >
              <Text
                direction={lineDir}
                className="font-semibold text-slate-800"
              >
                {item.stem}
              </Text>
              <span className="text-slate-500">+</span>
              <span
                className="rounded border border-emerald-200 bg-emerald-100 px-2 py-1 font-mono text-sm font-bold text-emerald-900"
                title={lineDir === "rtl" ? "المقطع الصحيح" : "Correct blend"}
              >
                {item.correctBlend}
              </span>
              {item.selected != null && (
                <span
                  className={cn("rounded px-2 py-1 font-mono text-sm", {
                    "bg-green-600 text-white": item.status === 1,
                    "bg-rose-500 text-white": item.status === 0,
                    "bg-slate-500 text-white": item.status === 2,
                  })}
                  dir={lineDir}
                >
                  {youLabel} <strong>{String(item.selected)}</strong>
                </span>
              )}
              {item.full && (
                <span className="text-slate-500 text-sm">({item.full})</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConsonantBlend;
