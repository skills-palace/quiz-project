import { useSelector } from "react-redux";
import Intro from "./intro";
import Quiz from "./quiz";
import LessonEnd from "./lesson-end";
const Lesson = ({ data }) => {
  const stage = useSelector(({ lesson }) => lesson.stage);

  return (
    <div className="container mx-auto max-w-6xl w-full py-3 sm:py-4 px-3 sm:px-4 max-[380px]:px-2.5">
      {stage === "intro" ? (
        <Intro data={data} />
      ) : stage === "quiz" ? (
        <Quiz data={data} />
      ) : (
        <LessonEnd id={data._id} />
      )}
    </div>
  );
};

export default Lesson;
