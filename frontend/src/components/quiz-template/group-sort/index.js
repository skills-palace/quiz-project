import React, { useMemo, useState } from "react";
import SortChip from "./SortChip";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";
import { findContainerKeyForItemId, moveItemBetween } from "./applyGroupTap";
import cn from "classnames";

/**
 * @typedef {{ id: string; title: string; mark?: number }} SortItem
 * @typedef {{ title?: string; items: SortItem[] }} GroupBlock
 */

export default function GroupSort({ quiz, nextQ }) {
  const [items, setItems] = useState(() => {
    const q = quiz?.quizes?.[0];
    if (!q) return { root: { items: [] } };
    return JSON.parse(JSON.stringify(q));
  });
  /** Picked item id (in any group / bank) */
  const [armedItemId, setArmedItemId] = useState(null);
  /** Picked target container to drop the next item into (mutually exclusive with armedItemId in UI) */
  const [armedTargetKey, setArmedTargetKey] = useState(null);
  const [error, setError] = useState("");

  const quizTitleDirection = detectDirection(quiz.title);

  const sourceKeyForArmed = useMemo(
    () => (armedItemId ? findContainerKeyForItemId(items, armedItemId) : null),
    [items, armedItemId]
  );

  const rootBankCount = items.root?.items?.length ?? 0;

  const contextHint = useMemo(() => {
    if (quizTitleDirection === "rtl") {
      if (armedTargetKey) {
        return "الخطوة التالية: انقر الكلمة التي تريد نقلها إلى المجموعة المحددة (بما فيها من مجموعة أخرى).";
      }
      if (armedItemId) {
        return "الخطوة التالية: انقر مجموعة أخرى أو البنك لوضع الكلمة هناك. يمكنك نقل الكلمات بين المجموعات دائماً.";
      }
      if (rootBankCount > 0) {
        return `توجد ${rootBankCount} كلمة/كلمات في البنك — انقلها جميعاً إلى المجموعات (كل مجموعة تحتاج عنصراً واحداً على الأقل قبل الإرسال).`;
      }
      return null;
    }
    if (armedTargetKey) {
      return "Next: tap a word to move it into the selected group (from the bank or another group).";
    }
    if (armedItemId) {
      return "Next: tap a group card or the bank to drop. You can always move a word from one group to another.";
    }
    if (rootBankCount > 0) {
      return `${rootBankCount} item(s) left in the word bank — place them in groups (each group needs at least one before submit).`;
    }
    return null;
  }, [
    armedItemId,
    armedTargetKey,
    quizTitleDirection,
    rootBankCount,
  ]);

  const validateAllContainers = () => {
    const isRootEmpty = (items.root?.items?.length || 0) === 0;
    const allContainersFilled = Object.keys(items)
      .filter((key) => key !== "root")
      .every((key) => (items[key].items || []).length > 0);
    return isRootEmpty && allContainersFilled;
  };

  const clearArms = () => {
    setArmedItemId(null);
    setArmedTargetKey(null);
  };

  const onActivateContainer = (key) => {
    setError("");
    if (armedItemId) {
      const fromKey = findContainerKeyForItemId(items, armedItemId);
      if (!fromKey) {
        clearArms();
        return;
      }
      if (fromKey === key) {
        setArmedItemId(null);
        return;
      }
      setArmedItemId(null);
      setArmedTargetKey(null);
      setItems((prev) => moveItemBetween(prev, armedItemId, fromKey, key));
      return;
    }
    if (armedTargetKey === key) {
      setArmedTargetKey(null);
    } else {
      setArmedTargetKey(key);
    }
  };

  const onItemClick = (itemId) => {
    setError("");
    if (armedTargetKey) {
      const fromKey = findContainerKeyForItemId(items, itemId);
      if (!fromKey) {
        clearArms();
        return;
      }
      if (fromKey === armedTargetKey) {
        setArmedTargetKey(null);
        return;
      }
      setArmedItemId(null);
      setArmedTargetKey(null);
      setItems((prev) => moveItemBetween(prev, itemId, fromKey, armedTargetKey));
      return;
    }
    if (armedItemId === itemId) {
      setArmedItemId(null);
    } else {
      setArmedItemId(itemId);
      setArmedTargetKey(null);
    }
  };

  const submitQuiz = () => {
    if (!validateAllContainers()) {
      setError(
        quizTitleDirection === "rtl"
          ? "يُرجى وضع كل العناصر في المجموعات المناسبة قبل الإرسال."
          : "Please place every item in a group before submitting."
      );
      return;
    }
    setError("");
    const q = { ...items };
    delete q.root;
    const answers = Object.entries(q).map(([id, value]) => ({
      id,
      items: (value.items || []).map((item) => item.id),
    }));
    nextQ({ id: quiz._id, answers });
  };

  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg sm:p-3">
      <div className="mb-4 md:mb-6">
        <AudioPlayer audioPath={quiz?.questionAudio} />
      </div>

      <QuestionTitleSpeechBar
        title={quiz.title}
        direction={quizTitleDirection}
        questionKey={String(quiz._id || "")}
      />
      <Text
        direction={quizTitleDirection}
        className={`${
          quizTitleDirection === "rtl"
            ? "text-right pb-2 text-base font-naskh font-semibold text-gray-800 sm:text-lg md:text-xl lg:text-xl"
            : "text-left pb-2 text-base font-sans font-semibold text-gray-800 sm:text-lg md:text-lg lg:text-lg"
        }`}
      >
        {quiz.title}
      </Text>
      <p
        className={
          quizTitleDirection === "rtl"
            ? "mb-2 text-xs leading-snug text-slate-600 font-naskh sm:text-sm"
            : "mb-2 text-xs leading-snug text-slate-600 font-sans sm:text-sm"
        }
      >
        {quizTitleDirection === "rtl"
          ? "انقر على عنصر ثم على مجموعة أو البنك (أو العكس). انقر مرة أخرى لإلغاء الاختيار. يمكنك نقل كلسة من أي مجموعة إلى أخرى في أي وقت."
          : "Tap an item, then a group or the bank (or the reverse). Tap again to deselect. You can move a chip between groups anytime."}
      </p>

      {contextHint && (
        <p
          className={cn(
            "mb-3 rounded-lg border border-sky-200 bg-sky-50/90 px-3 py-2.5 text-sm leading-relaxed sm:px-4 sm:text-base",
            quizTitleDirection === "rtl"
              ? "text-right text-slate-800 font-naskh"
              : "text-left text-slate-800 font-sans"
          )}
          role="status"
        >
          {contextHint}
        </p>
      )}

      <div className="grid w-full grid-flow-col grid-rows-3 gap-3 overflow-x-auto pb-1 sm:gap-4">
        {Object.entries(items).map(([key, value]) => {
          const itemTitleDirection = detectDirection(value.title);
          const isTargetGlowing = armedTargetKey === key;
          const isRoot = key === "root";
          const isDropTarget =
            Boolean(armedItemId) &&
            sourceKeyForArmed != null &&
            key !== sourceKeyForArmed;
          return (
            <div
              key={key}
              onClick={() => onActivateContainer(key)}
              className={`col-span-1 cursor-pointer touch-manipulation rounded-lg border-2 border-blue-500 bg-gradient-to-l from-sky-300 to-sky-200 p-2 shadow-lg transition active:opacity-95 sm:p-3 md:hover:border-blue-600 ${
                isTargetGlowing
                  ? "ring-2 ring-amber-500 ring-offset-1"
                  : isDropTarget
                    ? "ring-2 ring-emerald-500/80 ring-offset-1"
                    : "border-blue-500"
              } ${
                !isRoot
                  ? itemTitleDirection === "rtl"
                    ? "text-right text-base font-naskh font-semibold text-gray-800 sm:text-lg md:text-xl"
                    : "text-left text-base font-sans font-semibold sm:text-lg"
                  : ""
              }`}
            >
              {!isRoot && (
                <Text
                  direction={quizTitleDirection}
                  className={
                    quizTitleDirection === "rtl"
                      ? "text-right pb-2 text-gray-800"
                      : "text-left pb-2 text-gray-800"
                  }
                >
                  {value.title}
                </Text>
              )}
              <div
                className={`flex min-h-12 flex-wrap content-start items-center gap-2 rounded-lg border-2 border-blue-400 bg-white p-2 sm:min-h-[3.2rem] sm:p-2.5 ${
                  isRoot && isTargetGlowing ? "ring-1 ring-amber-300" : ""
                }`}
              >
                {value.items?.map((item) => (
                  <div key={item.id} className="inline-flex max-w-full shrink-0">
                    <SortChip
                      item={item}
                      isItemArmed={armedItemId === item.id}
                      onItemClick={() => onItemClick(item.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-rose-200 px-4 py-2 text-center font-naskh text-base font-semibold text-rose-600 shadow-md sm:px-6 sm:text-lg">
          {error}
        </div>
      )}

      <div className="mt-4 text-center sm:mt-6">
        <button
          type="button"
          onClick={submitQuiz}
          className={`inline-flex w-full max-w-xs touch-manipulation items-center justify-center px-8 py-3 sm:w-auto sm:max-w-none sm:px-10 min-h-12 md:min-h-[3.25rem] md:py-4 rounded-xl md:rounded-2xl font-semibold text-white shadow-md transition duration-300 ease-in-out active:scale-[0.98] md:hover:scale-105 ${
            quizTitleDirection === "rtl"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 font-naskh hover:from-blue-600 hover:to-blue-500 text-lg md:text-xl lg:text-2xl"
              : "bg-gradient-to-r from-blue-500 to-blue-600 font-sans hover:from-blue-600 hover:to-blue-500 text-lg md:text-xl"
          }`}
        >
          {quizTitleDirection === "rtl" ? "التالي" : "Submit"}
        </button>
      </div>
    </div>
  );
}
