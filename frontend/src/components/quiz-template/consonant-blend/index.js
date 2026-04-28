import { useState, useMemo } from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";
import cn from "classnames";

function shuffleOptions(arr) {
  if (!arr?.length) return arr || [];
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Renders one row per item: stem + blank + blend choices; submit all like math.
 * quiz.quizes: { id, stem, full, options: string[], mark }[]
 */
function ConsonantBlend({ quiz, nextQ }) {
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");

  const displayQuizes = useMemo(() => {
    return (quiz.quizes || [])
      .filter((item) => item != null)
      .map((item) => ({
        ...item,
        options: shuffleOptions(item.options || []),
      }));
  }, [
    quiz._id,
    JSON.stringify(
      (quiz.quizes || []).map((q) => ({
        id: q.id,
        stem: q.stem,
        o: q.options || [],
      }))
    ),
  ]);

  const pageDir = detectDirection(
    [
      quiz.title,
      ...displayQuizes.flatMap((i) => [
        i.stem,
        ...(i.options?.length ? i.options : []),
      ]),
    ]
      .filter(Boolean)
      .join(" ")
  );

  const selectBlend = (id, value) => {
    setAnswers((prev) => {
      const next = prev.filter((a) => a.id !== id);
      next.push({ id, answer: value });
      return next;
    });
    setError("");
  };

  const handleSubmit = () => {
    if (answers.length < displayQuizes.length) {
      if (pageDir === "rtl") {
        setError("يرجى الإجابة على جميع العناصر قبل الإرسال");
      } else {
        setError("Please complete every word before submitting.");
      }
      return;
    }
    setError("");
    nextQ({ id: quiz._id, answers });
  };

  return (
    <div
      className="rounded-xl bg-gradient-to-r from-cyan-50 to-sky-100 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg sm:p-3"
      dir={pageDir}
    >
      <div className="mb-4 md:mb-6">
        <AudioPlayer audioPath={quiz?.questionAudio} />
      </div>
      <QuestionTitleSpeechBar
        title={quiz.title}
        direction={pageDir}
        questionKey={String(quiz._id || "")}
      />
      <Text
        direction={pageDir}
        className={
          pageDir === "rtl"
            ? "text-right pb-4 pr-1 text-base text-gray-800 font-naskh font-semibold sm:pr-2 sm:text-lg md:text-xl"
            : "text-left pb-4 text-base text-gray-800 font-sans font-semibold sm:text-lg md:text-lg"
        }
      >
        {quiz.title}
      </Text>

      <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
        {displayQuizes.map((item) => {
          const itemDir = detectDirection(
            [item.stem, ...((item.options && item.options.length) ? item.options : [])]
              .filter(Boolean)
              .join(" ")
          );
          const chosen = answers.find((a) => a.id === item.id);
          const promptComplete =
            itemDir === "rtl" ? "أكمل الكلمة" : "Complete the word";
          const promptPick =
            itemDir === "rtl" ? "اختر المقطع" : "Pick a blend";
          return (
            <div
              key={item.id}
              className="rounded-xl border-2 border-sky-200 bg-white/90 p-2 shadow-sm sm:p-3 md:p-4"
              dir={itemDir}
            >
              <p
                className={cn(
                  "text-xs leading-snug text-slate-500 sm:text-sm mb-1.5 sm:mb-2",
                  itemDir === "rtl"
                    ? "text-right font-naskh"
                    : "text-left font-sans"
                )}
              >
                {promptComplete}
              </p>
              <p
                className={cn(
                  "mb-3 flex flex-wrap items-end gap-1 font-bold tracking-wide text-xl leading-tight sm:mb-3 sm:text-2xl md:text-3xl",
                  itemDir === "rtl"
                    ? "font-naskh leading-tight"
                    : "font-sans leading-tight"
                )}
                dir={itemDir}
              >
                <span className="text-slate-800">{item.stem}</span>
                <span
                  className={cn(
                    "inline-flex min-w-[2.5rem] justify-center border-b-4 border-sky-500 px-1 text-sky-600",
                    chosen ? "" : "text-slate-300"
                  )}
                >
                  {chosen ? chosen.answer : "___"}
                </span>
              </p>
              <p
                className={cn(
                  "mb-2 text-xs leading-snug text-slate-500 sm:text-sm",
                  itemDir === "rtl"
                    ? "text-right font-naskh"
                    : "text-left font-sans"
                )}
              >
                {promptPick}
              </p>
              <div
                className="flex flex-wrap gap-2 sm:gap-2.5"
                role="group"
                dir={itemDir}
              >
                {(item.options || []).map((opt, optIdx) => {
                  const active = chosen?.answer === opt;
                  return (
                    <button
                      key={`${item.id}-opt-${optIdx}`}
                      type="button"
                      onClick={() => selectBlend(item.id, opt)}
                      className={cn(
                        "min-h-11 touch-manipulation select-none rounded-xl border-2 px-3 py-2.5 text-base font-semibold transition active:scale-[0.98] sm:min-h-12 sm:px-4 sm:text-lg md:active:scale-100 md:text-xl md:hover:scale-[1.02]",
                        itemDir === "rtl" ? "font-naskh" : "font-sans",
                        active
                          ? "border-violet-600 bg-violet-100 text-violet-900 md:shadow-sm"
                          : "border-sky-200 bg-sky-50 text-slate-800 md:hover:border-sky-400"
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div
          className={cn(
            "mt-4 rounded-lg bg-rose-200 px-4 py-2 text-center font-semibold text-rose-600 shadow-md sm:mt-6 sm:px-6 sm:text-lg",
            pageDir === "rtl" ? "font-naskh" : "font-sans"
          )}
          dir={pageDir}
        >
          {error}
        </div>
      )}

      <div className="mt-4 text-center sm:mt-6" dir={pageDir}>
        <button
          type="button"
          onClick={handleSubmit}
          className={cn(
            "inline-flex w-full max-w-xs touch-manipulation items-center justify-center px-8 py-3 sm:w-auto sm:max-w-none sm:min-h-[3.25rem] sm:px-10 sm:py-4 min-h-12 rounded-xl md:rounded-2xl font-bold text-lg text-white shadow-md transition duration-300 ease-in-out active:scale-[0.98] md:hover:scale-105 md:text-xl",
            pageDir === "rtl"
              ? "font-naskh bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 lg:text-2xl"
              : "font-sans bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800"
          )}
        >
          {pageDir === "rtl" ? "إرسال" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default ConsonantBlend;
