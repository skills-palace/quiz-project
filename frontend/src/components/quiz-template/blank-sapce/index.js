import { useState } from "react";
import { DndContext, useSensor, useSensors } from "@dnd-kit/core";
import { PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

function Layout7({ nextQ, quiz }) {
  const [items, setItems] = useState(quiz.meta);
  const [inputValues, setInputValues] = useState({});
  const [error, setError] = useState("");

  const quizTitleDirection = detectDirection(quiz.title);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleChange = (id, value) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!validateInputs()) {
      if (quizTitleDirection === "rtl") {
        setError("يرجى ملء جميع الحقول المطلوبة قبل الإرسال");
      } else {
        setError("Please fill in all the required fields before submitting.");
      }
      return;
    }

    setError("");
    const answers = Object.values(inputValues);
    nextQ({ id: quiz._id, answers });
  };

  const validateInputs = () => {
    return quiz.quizes
      .filter((item) => item.type === "word")
      .every(
        (item) => inputValues[item.id] && inputValues[item.id].trim() !== ""
      );
  };

  return (
    <DndContext sensors={sensors}>
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
              ? "text-right pb-4 text-base text-gray-800 font-naskh font-semibold sm:text-lg md:text-xl"
              : "text-left pb-4 text-base text-gray-800 font-sans font-bold sm:text-lg md:text-lg"
          }`}
        >
          {quiz.title}
        </Text>

        <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2 leading-relaxed">
          {quiz.quizes.map((item) => {
            const segmentDir = detectDirection(item.title);
            return item.type === "newline" ? (
              <div
                key={item.id}
                className="my-2 w-full border-b border-gray-300"
              />
            ) : item.type === "word" ? (
              <input
                key={item.id}
                type="text"
                autoComplete="off"
                aria-label={
                  quizTitleDirection === "rtl" ? "فراغ للإجابة" : "Blank answer"
                }
                className="input-box mx-0.5 inline-block min-h-11 min-w-[4.75rem] max-w-[min(100%,12rem)] touch-manipulation rounded-lg border border-blue-300 bg-sky-50 px-2 py-2 text-center text-base font-medium transition-all sm:mx-1 sm:h-11 sm:w-20 md:min-h-0 md:text-lg"
                inputMode="text"
                placeholder=""
                value={inputValues[item.id] || ""}
                onChange={(e) => handleChange(item.id, e.target.value)}
              />
            ) : (
              <Text
                direction={segmentDir}
                key={item.id}
                className={`inline ${
                  segmentDir === "rtl"
                    ? "text-justify font-naskh text-base font-medium sm:text-lg md:text-xl"
                    : "inline text-justify font-sans text-base font-medium sm:text-lg md:text-lg"
                }`}
              >
                {item.title}
              </Text>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-rose-200 px-4 py-2 text-center font-naskh text-base font-semibold text-rose-600 shadow-md sm:px-6 sm:text-lg">
            {error}
          </div>
        )}

        <div className="mt-4 text-center md:mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full max-w-xs sm:w-auto sm:max-w-none ${
              quizTitleDirection === "rtl"
                ? "inline-flex items-center justify-center font-naskh bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl md:rounded-2xl px-8 py-3 md:px-10 md:py-4 min-h-12 md:min-h-[3.25rem] shadow-md transition duration-300 ease-in-out md:hover:scale-105 active:scale-[0.98] font-bold text-lg md:text-xl touch-manipulation"
                : "inline-flex items-center justify-center font-sans bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl md:rounded-2xl px-8 py-3 md:px-10 md:py-4 min-h-12 md:min-h-[3.25rem] shadow-md transition duration-300 ease-in-out md:hover:scale-105 active:scale-[0.98] font-bold text-lg md:text-xl touch-manipulation"
            }`}
          >
            {quizTitleDirection === "rtl" ? "التالي" : "Submit"}
          </button>
        </div>
      </div>
    </DndContext>
  );
}

export default Layout7;
