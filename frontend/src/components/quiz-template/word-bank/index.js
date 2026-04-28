import React, { useMemo, useState } from "react";
import { Text } from "@/components/StyledComponents";
import {
  detectDirection,
  layoutDirectionForSequencedQuiz,
} from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

function chipClass(dir) {
  const base =
    "min-h-11 touch-manipulation select-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base font-semibold text-slate-800 shadow-sm transition active:scale-[0.98] sm:min-h-0 sm:py-2 md:hover:border-sky-400 md:hover:bg-sky-50/80";
  return dir === "rtl" ? `${base} font-naskh` : `${base} font-sans`;
}

export default function WordBank({ quiz, nextQ }) {
  const bankWords = useMemo(
    () =>
      (Array.isArray(quiz.quizes) ? quiz.quizes : []).filter((w) => w != null),
    [quiz._id, quiz.quizes]
  );
  const [answer, setAnswer] = useState([]);

  const layoutDir = useMemo(
    () =>
      layoutDirectionForSequencedQuiz({ ...quiz, quizes: bankWords }),
    [quiz._id, quiz.title, bankWords]
  );
  const total = bankWords.length;

  const usedIds = useMemo(() => new Set(answer.map((w) => w.id)), [answer]);

  const addFromBank = (w) => {
    if (usedIds.has(w.id)) return;
    setAnswer((a) => [...a, w]);
  };

  const removeFromAnswer = (index) => {
    setAnswer((a) => a.filter((_, i) => i !== index));
  };

  const clearAll = () => setAnswer([]);

  const canSubmit = answer.length === total && total > 0;

  return (
    <div
      dir={layoutDir}
      className={`rounded-xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 to-sky-50 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg sm:p-3 md:p-4 ${
        layoutDir === "rtl" ? "font-naskh" : "font-sans"
      }`}
    >
      {quiz?.questionAudio && (
        <div className="mb-4 md:mb-6">
          <AudioPlayer audioPath={quiz.questionAudio} />
        </div>
      )}

      <QuestionTitleSpeechBar
        title={quiz.title}
        direction={layoutDir}
        questionKey={String(quiz._id || "")}
      />
      <Text
        direction={layoutDir}
        className={
          layoutDir === "rtl"
            ? "mb-3 text-right text-base font-semibold text-slate-800 font-naskh sm:text-lg md:text-xl"
            : "mb-3 text-left text-base font-semibold text-slate-800 font-sans sm:text-lg md:text-xl"
        }
      >
        {quiz.title}
      </Text>

      <p
        className={
          layoutDir === "rtl"
            ? "mb-2 text-xs leading-snug text-slate-600 font-naskh sm:text-sm"
            : "mb-2 text-xs leading-snug text-slate-600 font-sans sm:text-sm"
        }
      >
        {layoutDir === "rtl"
          ? "انقر على الكلمات لترتيب الجملة."
          : "Tap the words to build your answer."}
      </p>

      {/* Answer strip */}
      <div className="mb-4 min-h-12 rounded-xl border-2 border-dashed border-slate-300/90 bg-white/70 px-2 py-3 sm:min-h-[3.5rem] sm:px-3">
        <div
          className="flex min-h-[2.75rem] flex-wrap items-center gap-2 sm:min-h-[2.5rem] sm:gap-2"
          dir={layoutDir}
        >
          {answer.length === 0 ? (
            <span
              className={
                layoutDir === "rtl"
                  ? "text-sm text-slate-400 font-naskh"
                  : "text-sm text-slate-400 font-sans"
              }
            >
              {layoutDir === "rtl"
                ? "اضغط على الكلمات أدناه"
                : "Build your answer here"}
            </span>
          ) : (
            answer.map((w, idx) => {
              const wd = detectDirection(w.title);
              return (
                <button
                  key={`${w.id}-${idx}`}
                  type="button"
                  onClick={() => removeFromAnswer(idx)}
                  className={chipClass(wd)}
                  title={
                    layoutDir === "rtl"
                      ? "إرجاع إلى البنك"
                      : "Return to word bank"
                  }
                >
                  <span
                    dir={wd === "rtl" ? "rtl" : "ltr"}
                    className="inline-block text-inherit"
                  >
                    {w.title}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Word bank (fixed cells + placeholders) */}
      <p
        className={
          layoutDir === "rtl"
            ? "mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 font-naskh"
            : "mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 font-sans"
        }
      >
        {layoutDir === "rtl" ? "بنك الكلمات" : "Word bank"}
      </p>
      <div className="mb-4 flex flex-wrap gap-2 sm:gap-2.5" dir={layoutDir}>
        {bankWords.map((w) => {
          const inUse = usedIds.has(w.id);
          const wd = detectDirection(w.title);
          if (inUse) {
            return (
              <div
                key={w.id}
                className="min-h-11 min-w-[3rem] rounded-xl bg-slate-200/60 ring-1 ring-slate-300/50 sm:h-10 sm:min-h-0 sm:min-w-[2.5rem]"
                aria-hidden
              />
            );
          }
          return (
            <button
              key={w.id}
              type="button"
              onClick={() => addFromBank(w)}
              className={chipClass(wd)}
            >
              <span
                dir={wd === "rtl" ? "rtl" : "ltr"}
                className="inline-block text-inherit"
              >
                {w.title}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center"
        dir={layoutDir}
      >
        <button
          type="button"
          onClick={clearAll}
          className={
            layoutDir === "rtl"
              ? "touch-manipulation min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 font-naskh shadow-sm transition active:scale-[0.98] sm:min-h-11 sm:w-auto md:hover:bg-slate-50"
              : "touch-manipulation min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 font-sans shadow-sm transition active:scale-[0.98] sm:min-h-11 sm:w-auto md:hover:bg-slate-50"
          }
        >
          {layoutDir === "rtl" ? "مسح الكل" : "Clear"}
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() =>
            nextQ({
              id: quiz._id,
              answers: answer.map((ele) => ele.id),
            })
          }
          className={
            canSubmit
              ? layoutDir === "rtl"
                ? "inline-flex w-full max-w-none touch-manipulation items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 font-naskh text-lg font-bold text-white shadow-md transition active:scale-[0.98] min-h-12 sm:max-w-md sm:px-10 sm:py-4 sm:text-xl md:hover:scale-105 md:hover:from-emerald-600 md:hover:to-teal-700 lg:text-2xl"
                : "inline-flex w-full max-w-none touch-manipulation items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-3 font-sans text-lg font-bold text-white shadow-md transition active:scale-[0.98] min-h-12 sm:max-w-md sm:px-10 sm:py-4 sm:text-xl md:hover:scale-105 md:hover:from-emerald-600 md:hover:to-teal-700"
              : "min-h-12 cursor-not-allowed rounded-xl bg-slate-300 px-8 py-3 text-lg font-bold text-slate-500 w-full sm:w-auto opacity-75"
          }
        >
          {layoutDir === "rtl" ? "إرسال" : "Submit"}
        </button>
      </div>
    </div>
  );
}
