import { useState, useRef } from "react";
import LineDraw from "./line-draw";
import cn from "classnames";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

function Layout8({ nextQ, quiz }) {
  const [activeItem, setActiveItem] = useState({});
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(""); // Error state to display messages

  const leftRefs = useRef([]);
  const rightRefs = useRef([]);

  const setAnswer = (id, side) => {
    if (activeItem.side === side) return;
    const ans = side === "left" ? { id } : { ans_id: id };
    if (Object.keys(activeItem).length) {
      delete activeItem.side;
      setAnswers((prev) => [
        ...prev,
        {
          ...activeItem,
          ...ans,
        },
      ]);
      setActiveItem({});
    } else {
      return setActiveItem({
        ...ans,
        side,
      });
    }
  };

  const undoAnswer = (id, side) => {
    setAnswers((prev) =>
      prev.filter((ans) => !(ans.id === id || ans.ans_id === id))
    );
  };

  const handleClick = (item, side) => {
    if (answers.find((ele) => ele.id === item.id || ele.ans_id === item.id)) {
      undoAnswer(item.id, side);
    } else {
      setAnswer(item.id, side);
      setError(""); // Clear error when an item is selected
    }
  };

  const handleSubmit = () => {
    if (answers.length < quiz.quizes[0].left.length) {
      if (quizTitleDirection === "rtl") {
        setError("الرجاء إكمال جميع عمليات الاقتران قبل الإرسال.");
      } else {
        setError("Please complete all pairings before submitting.");
      }
      return;
    }

    setError(""); // Clear error if the quiz is valid
    nextQ({ id: quiz._id, answers });
  };

  const quizTitleDirection = detectDirection(quiz.title);
  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-4 shadow-lg sm:p-3">
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
            ? "text-right pb-4 pr-1 text-base text-gray-800 font-naskh font-semibold sm:pr-2 sm:text-lg md:text-xl"
            : "text-left pb-4 text-base text-gray-800 font-sans font-semibold sm:text-lg md:text-lg"
        }`}
      >
        {quiz.title}
      </Text>

      <div className="relative w-full">
        <svg id="q_svg_line">
          {answers.map((answer) => (
            <LineDraw
              key={answer.id}
              ref1={leftRefs.current.find((ele) => ele.id === answer.id).ref}
              ref2={
                rightRefs.current.find((ele) => ele.id === answer.ans_id).ref
              }
            />
          ))}
        </svg>

        <div
          className={`flex w-full flex-row items-stretch justify-between gap-2 px-0.5 sm:gap-3 md:gap-4 ${
            quizTitleDirection === "rtl"
              ? "font-naskh font-semibold text-gray-800"
              : "font-sans font-semibold text-gray-800"
          }`}
        >
          <div
            className={cn("group min-w-0 w-[38%] flex-shrink-0 sm:w-[36%] md:w-[35%]", {
              disabled: activeItem.side === "left",
            })}
          >
            {quiz?.quizes[0]?.left?.map((item, idx) => {
              const itemTitleDirection = detectDirection(item.title);
              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(item, "left")}
                  className={cn(
                    "mb-2 flex min-h-12 cursor-pointer touch-manipulation select-none items-center justify-end rounded-lg border border-blue-400 bg-blue-200 px-1.5 py-3 shadow sm:mb-3 sm:px-2 md:mb-3 md:hover:bg-yellow-300",
                    "group-[.disabled]:cursor-not-allowed group-[.disabled]:opacity-100",
                    {
                      "bg-gradient-to-r from-sky-300 to-sky-200 md:hover:from-rose-300 md:hover:to-rose-200":
                        activeItem.id === item.id,
                      "cursor-not-allowed border-2 border-blue-500 bg-gradient-to-r from-sky-300 to-sky-200 md:hover:from-rose-300 md:hover:to-rose-200":
                        answers.find((ele) => ele.id === item.id),
                    }
                  )}
                >
                  <Text
                    direction={itemTitleDirection}
                    className="min-w-0 flex-1 text-start text-sm sm:text-base md:text-lg"
                  >
                    {item.title}
                  </Text>
                  <span
                    ref={(ref) => {
                      leftRefs.current[idx] = { id: item.id, ref };
                    }}
                    className="bg-skin-primary ml-1.5 mr-1.5 inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full sm:ml-2 sm:mr-2 sm:h-3 sm:w-3"
                  ></span>
                </div>
              );
            })}
          </div>
          <div
            className={cn("group min-w-0 flex-1", {
              disabled: activeItem.side === "right",
            })}
          >
            {quiz?.quizes[0]?.right.map((item, idx) => {
              const itemTitleDirection = detectDirection(item.title);
              return (
                <div
                  key={item.id}
                  onClick={() => handleClick(item, "right")}
                  className={cn(
                    "mb-2 flex min-h-12 cursor-pointer touch-manipulation select-none items-center rounded-lg border border-blue-400 bg-blue-200 px-1.5 py-3 shadow sm:mb-3 sm:px-2 md:mb-3 md:hover:bg-yellow-300",
                    "group-[.disabled]:cursor-not-allowed group-[.disabled]:opacity-100",
                    {
                      "bg-gradient-to-l from-sky-300 to-sky-200 md:hover:from-rose-300 md:hover:to-rose-200":
                        activeItem.ans_id === item.id,
                      "cursor-not-allowed border-2 border-blue-500 bg-gradient-to-l from-sky-300 to-sky-200 md:hover:from-rose-300 md:hover:to-rose-200":
                        answers.find((ele) => ele.ans_id === item.id),
                    }
                  )}
                >
                  <span
                    ref={(ref) => {
                      rightRefs.current[idx] = { id: item.id, ref };
                    }}
                    className="bg-skin-primary ml-1.5 mr-1.5 inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full sm:ml-2 sm:mr-2 sm:h-3 sm:w-3"
                  ></span>

                  <Text
                    direction={itemTitleDirection}
                    className="min-w-0 flex-1 text-sm sm:text-base md:text-lg"
                  >
                    {item.title}
                  </Text>
                </div>
              );
            })}
          </div>
        </div>
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
  );
}

export default Layout8;
