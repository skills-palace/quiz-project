import React, { useState } from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

/** API / populate may omit root or items; always provide arrays so render never throws. */
function ensureClassificationShape(raw) {
  const base = raw && typeof raw === "object" ? { ...raw } : {};
  if (!base.root) base.root = { items: [] };
  if (!Array.isArray(base.root.items)) base.root.items = [];
  for (const key of Object.keys(base)) {
    if (key === "root") continue;
    if (!base[key] || typeof base[key] !== "object") {
      base[key] = { title: String(key), items: [] };
    } else {
      if (!("title" in base[key]) || base[key].title == null) {
        base[key].title = String(key);
      }
      if (!Array.isArray(base[key].items)) base[key].items = [];
    }
  }
  return base;
}

export default function App({ quiz, nextQ }) {
  const [items, setItems] = useState(() =>
    ensureClassificationShape(quiz?.quizes?.[0])
  );
  const [error, setError] = useState(""); // State for error messages

  const quizTitleDirection = detectDirection(quiz.title);

  const handleChange = (itemId, groupId) => {
    setItems((prevItems) => {
      const current = ensureClassificationShape(prevItems);
      const found = (current.root?.items || []).find(
        (item) => item && item.id === itemId
      );
      if (!found) return current;
      if (groupId === "root" || !current[groupId]) return current;
      const updatedItems = { ...current };
      Object.keys(updatedItems).forEach((key) => {
        if (key === "root") return;
        if (updatedItems[key]?.items) {
          updatedItems[key] = {
            ...updatedItems[key],
            items: updatedItems[key].items.filter(
              (item) => item && item.id !== itemId
            ),
          };
        }
      });
      if (!updatedItems[groupId]) return current;
      updatedItems[groupId] = {
        ...updatedItems[groupId],
        items: [...(updatedItems[groupId].items || []), found],
      };
      return updatedItems;
    });
  };

  const submitQuiz = () => {
    if (!validateAllItemsAssigned()) {
      if (quizTitleDirection === "rtl") {
        setError("يُرجى التأكد من تعيين كافة العناصر إلى مجموعة قبل الإرسال");
      } else {
        setError(
          "Please ensure all items are assigned to a group before submitting."
        );
      }
      return;
    }

    setError(""); // Clear any existing error messages
    const q = items;
    delete q.root;
    const answers = Object.entries(q).map(([key, value]) => ({
      id: key,
      items: (value?.items || []).map((item) => item?.id).filter(Boolean),
    }));
    nextQ({ id: quiz._id, answers });
  };

  const validateAllItemsAssigned = () => {
    const rootList = items?.root?.items ?? [];
    if (rootList.length === 0) return true;
    return rootList.every(
      (item) =>
        item &&
        Object.keys(items).some(
          (key) =>
            key !== "root" &&
            (items[key]?.items || []).some(
              (groupItem) => groupItem && groupItem.id === item.id
            )
        )
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 sm:p-3 rounded-xl shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <AudioPlayer audioPath={quiz?.questionAudio} />
      <QuestionTitleSpeechBar
        title={quiz.title}
        direction={quizTitleDirection}
        questionKey={String(quiz._id || "")}
      />
      <Text
          direction={quizTitleDirection}
          className={`${
            quizTitleDirection === "rtl"
            ? "text-right pb-4 text-gray-800 font-naskh font-semibold sm:text-lg md:text-lg lg:text-xl"
            : "text-left pb-4 text-gray-800 font-sans  font-semibold sm:text-lg md:text-lg lg:text-lg"
        }`}
        >
          {quiz.title}
        </Text>

      <div className="-mx-1 overflow-x-auto rounded-lg sm:mx-0">
        <table className="min-w-full table-auto border-collapse bg-white shadow-md">
          <thead>
            <tr className="rounded-lg border-b bg-blue-500">
              <th className="min-w-[120px] px-2 py-2 text-left text-xs font-medium text-white sm:px-4 sm:text-sm md:text-base">
                {quizTitleDirection === "rtl" ? "" : ""}
              </th>
              {Object.keys(items).map(
                (key) =>
                  key !== "root" && (
                    <th
                      key={key}
                      className="min-w-[72px] px-1 py-2 text-center text-xs font-medium text-white sm:min-w-[88px] sm:px-2 sm:text-sm md:text-base"
                    >
                      {items[key].title}
                    </th>
                  )
              )}
            </tr>
          </thead>
          <tbody>
            {(items?.root?.items ?? []).filter(Boolean).map((item) => (
              <tr
                key={item.id}
                className="odd:bg-gray-100 even:bg-gray-50 transition-colors md:hover:bg-gray-200"
              >
                <td className="border border-gray-300 px-2 py-3 sm:px-4">
                  <ItemWithRadioButtons
                    item={item}
                    items={items}
                    handleChange={handleChange}
                  />
                </td>
                {Object.keys(items).map(
                  (key) =>
                    key !== "root" && (
                      <td
                        key={key}
                        className="border border-gray-300 p-0 align-middle"
                      >
                        <div className="flex min-h-12 items-center justify-center touch-manipulation px-1 py-2 sm:min-h-[3rem] lg:min-h-0">
                          <input
                            type="radio"
                            name={item.id}
                            value={key}
                            onChange={() => handleChange(item.id, key)}
                            className="h-5 w-5 cursor-pointer touch-manipulation accent-blue-500 transition md:hover:scale-110"
                          />
                        </div>
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="text-rose-600 text-center font-naskh mt-4 px-6 py-2 rounded-lg bg-rose-200 shadow-md font-semibold sm:text-lg md:text-lg lg:text-lg">{error}</div>
      )}

      <div className="mt-4 text-center md:mt-6">
        <button
          type="button"
          onClick={submitQuiz}
          className={`inline-flex w-full max-w-xs touch-manipulation items-center justify-center px-8 py-3 sm:w-auto sm:max-w-none sm:px-10 min-h-12 md:min-h-[3.25rem] md:py-4 rounded-xl md:rounded-2xl font-semibold text-white shadow-md transition duration-300 ease-in-out active:scale-[0.98] md:hover:scale-105 ${
            quizTitleDirection === "rtl"
              ? "font-naskh bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-lg md:text-xl lg:text-2xl"
              : "font-sans bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-lg md:text-xl"
          }`}
        >
          {quizTitleDirection === "rtl" ? "التالي" : "Submit"}
        </button>
      </div>
    </div>
  );
}

function ItemWithRadioButtons({ item }) {
  const quizTitleDirection = detectDirection(item.title);
  return (
    <div
      className={`text-gray-700 ${
        quizTitleDirection === "rtl"
          ? "text-right font-naskh text-base font-medium sm:text-lg md:text-xl"
          : "font-sans text-left text-base font-medium md:text-lg"
      }`}
    >
      <Text direction={quizTitleDirection}>{item.title}</Text>
    </div>
  );
}
