import { BtnBlue } from "@/ui/btn";
import { useState } from "react";
import { useGetQuizInfiniteQuery } from "@/redux/api/quiz-api";

import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

const QuizListModal = ({ onChange, value, setModal }) => {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(value);

  const { data, isFetching, isError, error } = useGetQuizInfiniteQuery({
    page,
  });

  const handleSelected = (quiz) => {
    const idx = selected.findIndex((ele) => ele._id == quiz._id);

    if (idx < 0) {
      setSelected((prev) => [...prev, quiz]);
    } else {
      selected.splice(idx, 1);
      setSelected([...selected]);
    }
  };
  console.log("quiz", data);
  return (
    <div>
      {isFetching
        ? "loading"
        : isError
        ? "somneth"
        : data.result.length
        ? data.result.map((quiz) => {
            const quizTitleDirection = detectDirection(quiz.title);
            return (
              <div
                key={quiz._id}
                onClick={() => handleSelected(quiz)}
                className={` p-2 rounded shadow mb-3 ${
                  selected.find((el) => el._id === quiz._id)
                    ? "bg-blue-400 text-white"
                    : "bg-gray-100"
                }`}
              >
                <Text direction={quizTitleDirection} className="text-sm">
                  {quiz.title}
                </Text>
                <p className="text-xs space-x-1">
                  <span>mark:</span> <span>{quiz.total_mark}</span>
                  <span>type:</span> <span>{quiz.type}</span>
                </p>
              </div>
            );
          })
        : "quiz not available"}

      <div className="text-end mb-2">
        <BtnBlue
          disabled={selected.length === 0}
          onClick={() => {
            onChange(selected), setModal(false);
          }}
          type="button"
          className="mt-2 p-2 text-sm rounded disabled:bg-gray-100 disabled:text-gray-700 disabled:cursor-not-allowed"
        >
          Add Selected
        </BtnBlue>
      </div>
    </div>
  );
};

export default QuizListModal;
