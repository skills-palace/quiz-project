import { useState, useEffect } from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

function Layout7({ nextQ, quiz }) {
  const [highlightedWords, setHighlightedWords] = useState(new Set());
  const [error, setError] = useState("");

  const paragraph = quiz?.raw || [];
  const title = quiz?.title || "Untitled Quiz";
  const titleDirection = detectDirection(title);

  useEffect(() => {
    console.log("Extracted Paragraph:", paragraph);
  }, [paragraph]);

  const handleWordClick = (id) => {
    setHighlightedWords((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
    setError("");
  };

  const handleSubmit = () => {
    if (highlightedWords.size === 0) {
      setError(
        detectDirection(title) === "rtl"
          ? "يرجى تحديد كلمة واحدة على الأقل قبل الإرسال."
          : "Please select at least one word before submitting."
      );
      return;
    }
    nextQ({ id: quiz._id, answers: Array.from(highlightedWords) });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 sm:p-3 rounded-xl shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="">
        <div className="p-0">
          <AudioPlayer audioPath={quiz?.questionAudio} />
          <QuestionTitleSpeechBar
            title={title}
            direction={titleDirection}
            questionKey={String(quiz._id || "")}
          />
          {title && (
            <Text
              direction={titleDirection}
              className={`mb-0   ${
                titleDirection === "rtl"
                ? "text-right pb-4 text-gray-800 font-naskh font-semibold sm:text-lg md:text-lg lg:text-xl"
                : "text-left pb-4 text-gray-800 font-sans  font-semibold sm:text-lg md:text-lg lg:text-lg"
            }`}
            >
              {title}
            </Text>
          )}
          <div className="p-1.5 sm:p-2 md:p-3 rounded-xl shadow-lg bg-gradient-to-l from-sky-300 to-sky-200 border-2 border-blue-500">
            {paragraph.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                {paragraph.map((item) => (
                  <span
                    key={item.id}
                    onClick={() => handleWordClick(item.id)}
                    onKeyPress={(e) => e.key === "Enter" && handleWordClick(item.id)}
                    tabIndex="0"
                    role="button"
                    className={`inline-flex cursor-pointer items-center justify-center min-h-11 px-3 py-1.5 sm:min-h-12 sm:px-3 sm:py-2 lg:min-h-0 lg:px-2 lg:py-1.5 transition-all rounded-lg touch-manipulation select-none ${
                      detectDirection(title) === "rtl"
                        ? "text-gray-800 font-naskh text-justify font-semibold text-base sm:text-lg md:text-xl lg:text-2xl"
                        : "text-gray-800 font-sans text-justify font-semibold text-base sm:text-lg md:text-xl lg:text-xl"
                    } ${
                      highlightedWords.has(item.id)
                        ? "bg-yellow-300 text-gray-800 font-semibold shadow-md md:scale-105 scale-[1.02] active:scale-[0.98]"
                        : "md:hover:bg-yellow-200 md:hover:scale-105 active:bg-yellow-200/90 active:scale-[0.98]"
                    }`}
                  >
                    {item.title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                {detectDirection(title) === "rtl" ? "لا يوجد محتوى لعرضه." : "No content to display."}
              </p>
            )}
          </div>
          {error && (
          <div className="text-rose-600 text-center font-naskh mt-4 px-6 py-2 rounded-lg bg-rose-200 shadow-md font-semibold sm:text-lg md:text-lg lg:text-lg">
            {error}
            </div>
          )}
          <div className="text-center mt-4 md:mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className={`w-full max-w-xs sm:w-auto sm:max-w-none inline-flex items-center justify-center min-h-12 md:min-h-[3.25rem] px-8 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl shadow-md font-semibold transition duration-300 ease-in-out touch-manipulation active:scale-[0.98] md:hover:scale-105 ${
                detectDirection(title) === "rtl"
                  ? "font-naskh bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white text-lg md:text-xl lg:text-2xl"
                  : "font-sans bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white text-lg md:text-xl lg:text-xl"
              }`}
            >
              {detectDirection(title) === "rtl" ? "التالي" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout7;
