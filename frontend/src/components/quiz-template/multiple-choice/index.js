import Image from "next/image";
import { useState } from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

function Layout1({ quiz, nextQ }) {
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(""); // Error state for handling submission without answers

  const answer = (id) => {
    const nextAnswers = [{ id, answer: true }];
    setAnswers(nextAnswers);
    setError(""); // Clear error when an option is selected
  };

  const handleSubmit = () => {
    if (answers.length === 0) {
      if (quizTitleDirection === "rtl") {
        setError("يرجى تحديد خيار واحد على الأقل قبل الإرسال");
      } else {
        setError("Please select at least one option before submitting.");
      }
      return;
    }

    setError(""); // Clear error if the quiz is valid
    nextQ({ id: quiz._id, answers });
  };

  const quizTitleDirection = detectDirection(quiz.title);
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

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {quiz.quizes.map((item) => {
          const itemTitleDirection = detectDirection(item.title);
          return (
            <div
              key={item.id}
              onClick={() => answer(item.id)}
              className={`${
                quizTitleDirection === "rtl"
                  ? "min-h-12 px-3 py-3 md:min-h-[3.75rem] md:px-4 md:py-4 text-center font-naskh cursor-pointer rounded-xl md:rounded-2xl shadow-lg border-4 md:border-8 border-transparent transition duration-300 ease-in-out md:hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl font-semibold text-lg sm:text-xl md:text-2xl flex flex-col items-center justify-center touch-manipulation"
                  : "min-h-12 px-3 py-3 md:min-h-[3.75rem] md:px-4 md:py-4 text-center font-sans cursor-pointer rounded-xl md:rounded-2xl shadow-lg border-4 md:border-8 border-transparent transition duration-300 ease-in-out md:hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl font-semibold text-lg sm:text-xl md:text-2xl flex flex-col items-center justify-center touch-manipulation"
              } ${
                answers.find((el) => el.id === item.id)
                  ? "bg-gradient-to-r from-pink-300 to-pink-200 hover:from-pink-300 hover:to-pink-200 border-pink-600 scale-105"
                  : "bg-gradient-to-r from-sky-300 to-sky-200 hover:from-rose-300 hover:to-rose-200 border-sky-600 scale-100"
              }`}
            >
              {item?.image && item?.image !== "undefined" && (
                <Image
                  className="mb-4 rounded-xl shadow-md"
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/file/image/${item.image}`}
                  width={500}
                  height={300}
                  alt="multiple quiz"
                />
              )}

              <Text
                direction={itemTitleDirection}
                className="text-gray-800 font-senibold text-base sm:text-lg md:text-xl"
              >
                {item.title}
              </Text>
            </div>
          );
        })}
      </div>

      {error && <div className="text-rose-600 text-center font-naskh mt-4 px-6 py-2 rounded-lg bg-rose-200 shadow-md font-semibold sm:text-lg md:text-lg lg:text-lg">{error}</div>}

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

export default Layout1;
