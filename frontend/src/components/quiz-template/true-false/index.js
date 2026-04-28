import { useState } from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

function Layout9({ quiz, nextQ }) {
  const [quizes, setQuizes] = useState(quiz.quizes);
  const [error, setError] = useState(""); // State for error messages

  // Handle answer selection
  const answer = (id, answer) => {
    setQuizes((prev) => {
      let items = [...prev];
      let idx = items.findIndex((q) => q.id === id);
      let q = items[idx];

      q = { ...q, answer, isAnswer: true };

      items[idx] = q;

      return items;
    });
  };

  // Validate that all questions have been answered
  const validateAnswers = () => {
    const allAnswered = quizes.every((item) => item.isAnswer);
    return allAnswered;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateAnswers()) {
      if (quizTitleDirection === "rtl") {
        setError("يرجى الإجابة على جميع الأسئلة قبل الإرسال");
      } else {
        setError("Please answer all questions before submitting.");
      }
      return;
    }

    setError(""); // Clear any existing error messages
    nextQ({ id: quiz._id, answers: quizes });
  };

  const quizTitleDirection = detectDirection(quiz.title);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-xl shadow-lg">
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
            ? "text-right pb-3 sm:pb-4 text-base leading-relaxed sm:text-lg md:text-lg lg:text-xl text-gray-800 font-naskh font-semibold"
            : "text-left pb-3 sm:pb-4 text-base leading-relaxed sm:text-lg md:text-lg lg:text-lg text-gray-800 font-sans font-semibold"
        }`}
      >
        {quiz.title}
      </Text>

      <div className="w-full max-w-4xl font-naskh font-semibold text-base sm:text-lg">
        <div className="flex min-h-11 justify-between items-center bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg px-2.5 py-2 sm:p-3 mb-2">
          <h2 className="font-sans shrink-0">
            {quizTitleDirection === "rtl" ? (
              <span className="font-naskh text-white text-sm sm:text-base md:text-lg">الْجُمْلَةُ</span>
            ) : (
              <span className="font-sans text-white text-sm sm:text-base md:text-lg">Sentences</span>
            )}
          </h2>
          <div className="flex gap-3 sm:gap-5 shrink-0">
            <span className="text-lg sm:text-xl text-green-400 leading-none" aria-hidden="true">
              ✓
            </span>
            <span className="text-lg sm:text-xl text-red-500 leading-none" aria-hidden="true">
              ✘
            </span>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {quizes.map((item) => {
            return (
              <div
                key={item.id}
                className="flex justify-between items-center gap-2 min-h-12 sm:min-h-0 py-1.5 sm:py-2 px-2 sm:px-2 shadow-lg rounded-lg border bg-gradient-to-r from-sky-200 to-sky-300 border-sky-600"
              >
                <Text
                  direction={quizTitleDirection}
                  className={`min-w-0 flex-1 ${
                    quizTitleDirection === "rtl"
                      ? "text-right px-1 sm:p-2 text-base leading-relaxed sm:text-lg md:text-lg lg:text-xl text-gray-800 font-naskh font-semibold"
                      : "text-left px-1 sm:p-2 text-base leading-relaxed sm:text-lg md:text-lg lg:text-lg text-gray-800 font-sans font-semibold"
                  }`}
                >
                  {item.title}
                </Text>

                <div className="flex items-center shrink-0 gap-2 sm:gap-4 px-1 min-h-[2.75rem] sm:min-h-0">
                  <label className="flex items-center justify-center min-w-[2.75rem] min-h-[2.75rem] sm:min-w-0 sm:min-h-0 cursor-pointer touch-manipulation">
                    <input
                      type="radio"
                      className="h-6 w-6 sm:h-5 sm:w-5 cursor-pointer appearance-none rounded-full border-2 border-green-600 checked:bg-green-600 checked:border-green-600"
                      checked={item.answer}
                      onChange={() => answer(item.id, true)}
                    />
                  </label>

                  <label className="flex items-center justify-center min-w-[2.75rem] min-h-[2.75rem] sm:min-w-0 sm:min-h-0 cursor-pointer touch-manipulation">
                    <input
                      type="radio"
                      className="h-6 w-6 sm:h-5 sm:w-5 cursor-pointer appearance-none rounded-full border-2 border-red-500 checked:bg-red-500 checked:border-red-500"
                      checked={item.isAnswer && !item.answer}
                      onChange={() => answer(item.id, false)}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="text-rose-600 text-center font-naskh mt-4 px-4 sm:px-6 py-2 rounded-lg bg-rose-200 shadow-md font-semibold text-sm sm:text-base md:text-lg">
          {error}
        </div>
      )}

      <div className="text-center mt-4 md:mt-6">
        <button
          type="button"
          onClick={handleSubmit}
          className={`w-full max-w-xs sm:w-auto sm:max-w-none ${
            quizTitleDirection === "rtl"
              ? "font-naskh bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl md:rounded-2xl px-8 py-3 md:px-10 md:py-4 min-h-12 md:min-h-[3.25rem] shadow-md transition duration-300 ease-in-out md:hover:scale-105 active:scale-[0.98] font-bold text-lg md:text-xl touch-manipulation inline-flex items-center justify-center"
              : "font-sans bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white rounded-xl md:rounded-2xl px-8 py-3 md:px-10 md:py-4 min-h-12 md:min-h-[3.25rem] shadow-md transition duration-300 ease-in-out md:hover:scale-105 active:scale-[0.98] font-bold text-lg md:text-xl touch-manipulation inline-flex items-center justify-center"
          }`}
        >
          {quizTitleDirection === "rtl" ? "التالي" : "Submit"}
        </button>
      </div>
    </div>
  );
  
}

export default Layout9;
