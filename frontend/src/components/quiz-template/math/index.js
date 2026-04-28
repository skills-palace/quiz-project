import { useState } from "react";
import Item from "./Item";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import AudioPlayer from "../auidioPlayer";
import QuestionTitleSpeechBar from "../QuestionTitleSpeechBar";

function Layout6({ quiz, nextQ }) {
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState(""); // Error state to display messages

  const answer = (id, answer) => {
    setAnswers((prev) => {
      let items = [...prev];
      let ans = items.find((q) => q.id === id);

      if (ans) {
        ans.answer = answer;
      } else {
        items.push({ id, answer });
      }
      setError(""); // Clear error when an answer is provided
      return [...items];
    });
  };

  const handleSubmit = () => {
    if (answers.length < quiz.quizes.length) {
      if (quizTitleDirection === "rtl") {
        setError("يرجى الإجابة على جميع الأسئلة قبل الإرسال");
      } else {
        setError("Please answer all questions before submitting.");
      }
      return;
    }

    setError(""); // Clear error if the quiz is valid
    nextQ({ id: quiz._id, answers });
  };

  const quizTitleDirection = detectDirection(quiz.title);
  return (
    <div className="left type6">
         <AudioPlayer audioPath={quiz?.questionAudio} />
      <QuestionTitleSpeechBar
        title={quiz.title}
        direction={quizTitleDirection}
        questionKey={String(quiz._id || "")}
      />
      <Text
        direction={quizTitleDirection}
        className="text-lg font-medium text-gray-700 mb-2"
      >
        {quiz.title}
      </Text>

      <div className="bg-blue-500 grid grid-cols-1 gap-y-0.5 p- rounded border-2 border-blue-500 font-medium">
        {quiz.quizes.map((item) => (
          <Item key={item.id} item={item} answer={answer} />
        ))}
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <div className="text-center mt-3">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 rounded px-4 py-2 text-white mt-4"
        >
          {quizTitleDirection === "rtl" ? "التالي" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default Layout6;
