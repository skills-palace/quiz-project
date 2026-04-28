import cn from "classnames";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import CorrectAnswerStrip from "../CorrectAnswerStrip";

const MultipleChoice = ({ quiz, idx }) => {
  const quizTitleDirection = detectDirection(quiz.title);
  return (
    <div className="mb-4 bg-sky-100 shadow-md p-2 rounded">
      <Text
        direction={quizTitleDirection}
        className={`${quizTitleDirection==='rtl'? " mb-1 text-[20px] font-naskh font-semibold":
          " mb-1 text-[20px] font-sans font-semibold"}`}>
      
       {`${idx + 1}. ${quiz.title}`}</Text>
      <CorrectAnswerStrip
        titleText={quiz.title}
        review={quiz.review}
      />
      <div className={`${quizTitleDirection==='rtl'? "grid grid-cols-2 gap-2 text-gray-700 mb-1  text-[20px] font-naskh":
          "grid grid-cols-2 gap-2  mb-1  text-[16px] font-sans "}`}>
        {quiz.quiz_items.map((item, j) => {
          const optDir = detectDirection(item.title);
          return (
            <Text
              direction={optDir}
              key={j}
              className={cn(
                "px-2 py-3 text-white rounded text-[18px] ring-2",
                {
                  "bg-amber-500 ring-amber-200":
                    item.isCorrectOption && item.status === 0,
                  "bg-blue-400 ring-blue-300/50":
                    !item.isCorrectOption && item.status === 0,
                  "bg-green-600 ring-emerald-300": item.status === 1,
                  "bg-red-400 ring-red-300/50": item.status === 2,
                }
              )}
            >
              {item.title}
            </Text>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoice;
