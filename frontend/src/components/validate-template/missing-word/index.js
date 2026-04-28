import { useMemo } from "react";
import DropBox from "./DropBox";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

/** Full reference sentence: blanks = expected word; skips plain distractor `wrong_word`; spaces between pieces. */
function buildCorrectMissingWordSentence(items) {
  if (!Array.isArray(items)) {
    return "";
  }
  const parts = [];
  for (const n of items) {
    // Legacy: a word blank mis-tagged as wrong_word (old validator) but still has expectedTitle
    if (n.type === "wrong_word") {
      if (
        n.expectedTitle != null &&
        String(n.expectedTitle).trim() !== ""
      ) {
        parts.push(String(n.expectedTitle).trim());
      }
      continue;
    }
    if (n.type === "newline") {
      parts.push("\n");
      continue;
    }
    if (n.type === "word") {
      const s =
        n.expectedTitle != null && String(n.expectedTitle).trim() !== ""
          ? String(n.expectedTitle).trim()
          : n.title != null
            ? String(n.title).trim()
            : "";
      if (s) {
        parts.push(s);
      }
      continue;
    }
    if (n.title != null) {
      const s = String(n.title).trim();
      if (s) {
        parts.push(s);
      }
    }
  }
  return parts.reduce((acc, piece) => {
    if (piece === "\n") {
      return acc + "\n";
    }
    if (!acc) {
      return piece;
    }
    if (acc.endsWith("\n")) {
      return acc + piece;
    }
    return `${acc} ${piece}`;
  }, "");
}

const Index = ({ quiz, idx }) => {
  const quizTitleDirection = detectDirection(quiz.title);

  const correctSentence = useMemo(
    () => buildCorrectMissingWordSentence(quiz?.quiz_items),
    [quiz?.quiz_items]
  );

  const sentenceDirection =
    correctSentence.length > 0
      ? detectDirection(correctSentence)
      : quizTitleDirection;

  return (
    <div className="mb-4 bg-sky-100 shadow-md p-2 rounded">
      <Text
        direction={quizTitleDirection}
        className={`${
          quizTitleDirection === "rtl"
            ? "text-[20px] font-naskh font-bold"
            : " text-[20px] font-sans font-semibold"
        }`}
      >
        {`${idx + 1}. ${quiz.title}`}
      </Text>
      {correctSentence.trim() !== "" && (
        <p
          dir={sentenceDirection}
          className={
            sentenceDirection === "rtl"
              ? "mt-2 mb-2 rounded-md border border-emerald-200 bg-emerald-50/90 px-2 py-1.5 text-sm text-emerald-900 font-naskh whitespace-pre-wrap"
              : "mt-2 mb-2 rounded-md border border-emerald-200 bg-emerald-50/90 px-2 py-1.5 text-sm text-emerald-900 font-sans whitespace-pre-wrap"
          }
        >
          <span className="font-bold text-emerald-800">
            {quizTitleDirection === "rtl"
              ? "الجملة الصحيحة: "
              : "Correct sentence: "}
          </span>
          {correctSentence}
        </p>
      )}
      <div
        className={`${
          quizTitleDirection === "rtl"
            ? "text-[20px] font-naskh"
            : " mb-1 p-1  text-[18px] font-sans"
        }`}
      >
        {quiz.quiz_items.map((n) => {
          const itemDirection = detectDirection(n.title);
          return n.type === "word" ||
            (n.type == "wrong_word" && n.status === 0) ? (
            <DropBox key={n.id} item={n} />
          ) : n.type === "newline" ? (
            <div
              key={n.id}
              className="w-full border-b border-gray-300 my-2"
            ></div>
          ) : (
            n.type !== "wrong_word" && (
              <span
                direction={itemDirection}
                key={n.id}
                className={`${
                  itemDirection === "rtl"
                    ? "inline text-[20px] font-naskh"
                    : "inline text-[18px] font-sans"
                }`}
              >
                {n.title}
              </span>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Index;
