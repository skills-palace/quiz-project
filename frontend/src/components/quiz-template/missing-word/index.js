import { useState } from "react";
import ItemBox from "./ItemBox";
import DropBox from "./DropBox";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";
import { applyMoveToItems } from "./applyMove";

/** First blank in sentence order with no word placed. */
function findFirstEmptyBlankId(quiz, itemsState) {
  if (!quiz?.quizes) {
    return null;
  }
  for (const q of quiz.quizes) {
    if (q.type === "word" && itemsState[q.id] == null) {
      return q.id;
    }
  }
  return null;
}

function Layout7({ nextQ, quiz }) {
  const [items, setItems] = useState(quiz.meta);
  const [error, setError] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [focusedBlankId, setFocusedBlankId] = useState(null);

  const quizTitleDirection = detectDirection(quiz.title);

  const runMove = (activeId, overId) => {
    setItems((prev) => applyMoveToItems(prev, activeId, overId));
  };

  const clearSelection = () => {
    setSelectedWord(null);
    setFocusedBlankId(null);
  };

  const handleBankWordClick = (item) => {
    if (focusedBlankId != null && items[focusedBlankId] == null) {
      runMove(item.id, focusedBlankId);
      clearSelection();
      return;
    }
    const firstEmpty = findFirstEmptyBlankId(quiz, items);
    if (firstEmpty != null) {
      runMove(item.id, firstEmpty);
      clearSelection();
      return;
    }
    if (selectedWord?.id === item.id) {
      setSelectedWord(null);
      return;
    }
    setSelectedWord(item);
    setFocusedBlankId(null);
  };

  const handleEmptyBlankClick = (blankId) => {
    if (items[blankId] != null) {
      return;
    }
    if (selectedWord) {
      runMove(selectedWord.id, blankId);
      clearSelection();
      return;
    }
    setFocusedBlankId((f) => (f === blankId ? null : blankId));
  };

  const handleReturnToBank = (blankId) => {
    const inBlank = items[blankId];
    if (!inBlank) {
      return;
    }
    runMove(inBlank.id, "quizItems");
    clearSelection();
  };

  const handlePlaceFromBankOnFilled = (blankId) => {
    if (!selectedWord) {
      return;
    }
    runMove(selectedWord.id, blankId);
    clearSelection();
  };

  const handleSubmit = () => {
    const q = { ...items };
    delete q.root;

    const answers = Object.values(q)
      .map((value) => value?.id)
      .filter((answer) => answer !== null && answer !== undefined);

    const hasAtLeastOneAnswer = answers.length > 0;

    if (hasAtLeastOneAnswer) {
      setError("");
      nextQ({ id: quiz._id, answers });
    } else {
      if (quizTitleDirection === "rtl") {
        setError("يرجى ملء الفراغات قبل الإرسال");
      } else {
        setError("Please answer at least one question before submitting.");
      }
    }
  };

  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-2 sm:p-3 shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
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
            ? "pb-4 text-right text-gray-800 font-naskh font-semibold sm:text-lg md:text-lg lg:text-xl"
            : "pb-4 text-left text-gray-800 font-sans  font-semibold sm:text-lg md:text-lg lg:text-lg"
        }`}
      >
        {quiz.title}
      </Text>
      <p
        className={
          quizTitleDirection === "rtl"
            ? "mb-2 text-xs sm:text-sm text-slate-600 font-naskh leading-snug"
            : "mb-2 text-xs sm:text-sm text-slate-600 font-sans leading-snug"
        }
      >
        {quizTitleDirection === "rtl"
          ? "انقر كلمة في البنك لتضعها تلقائياً في أول فراغ فارغ. أو انقر فراغاً محدداً ثم كلمة. انقر الكلمة داخل الفراغ لإرجاعها إلى البنك."
          : "Tap a word in the bank to drop it into the next empty blank (reading order). Or tap a specific blank first, then a word. Tap a word in a blank to send it back to the bank."}
      </p>
      <div>
        <ItemBox
          items={items.root}
          onWordClick={handleBankWordClick}
          selectedWordId={selectedWord?.id ?? null}
        />
        <div>
          {quiz.quizes.map((item) => {
            const lineDir = detectDirection(item.title);
            return item.type === "newline" ? (
              <div
                key={item.id}
                className="my-4 w-full border-b border-blue-300"
              />
            ) : item.type === "word" ? (
              <DropBox
                key={item.id}
                id={item.id}
                item={items[item.id]}
                isFocused={focusedBlankId === item.id}
                selectedWord={selectedWord}
                onBlankClick={handleEmptyBlankClick}
                onReturnWord={handleReturnToBank}
                onPlaceFromBankOnFilled={handlePlaceFromBankOnFilled}
              />
            ) : (
              <Text
                direction={lineDir}
                key={item.id}
                className={`${
                  lineDir === "rtl"
                    ? "mb-4 inline text-justify text-base sm:text-lg md:text-xl font-naskh font-semibold leading-[2.75rem] sm:leading-[3rem] md:leading-[3.2rem] text-gray-800"
                    : "mb-4 inline text-justify text-base font-sans sm:text-lg md:text-xl leading-[2rem] sm:leading-[2.2rem] md:leading-[2.3rem] font-semibold text-gray-800"
                }`}
              >
                {item.title}
              </Text>
            );
          })}
        </div>
      </div>
      {error && (
        <div className="mt-4 rounded-lg bg-rose-200 px-6 py-2 text-center font-naskh font-semibold text-rose-600 shadow-md sm:text-lg md:text-lg lg:text-lg">
          {error}
        </div>
      )}
      <div className="mt-4 text-center md:mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className={`inline-flex min-h-12 w-full max-w-xs items-center justify-center touch-manipulation px-8 py-3 sm:w-auto sm:max-w-none md:min-h-[3.25rem] md:px-10 md:py-4 rounded-xl md:rounded-2xl font-bold text-white shadow-md transition duration-300 ease-in-out active:scale-[0.98] md:hover:scale-105 ${
            quizTitleDirection === "rtl"
              ? "font-naskh bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-lg md:text-xl lg:text-2xl"
              : "font-sans bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-lg md:text-xl lg:text-xl"
          }`}
        >
          {quizTitleDirection === "rtl" ? "التالي" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default Layout7;
