import QuizTemplate from "./quiz-template";
import CountDown from "./count-down";
import { useDispatch } from "react-redux";
import { setStage } from "@/redux/slices/lesson-slice";
import { layoutDirectionForLesson } from "@/utils/detectDirection";
import LessonStatsBar from "./LessonStatsBar";

function Quiz({ data }) {
  const dispatch = useDispatch();

  const quizEnd = () => {
    dispatch(setStage("end"));
  };

  const pageDir = layoutDirectionForLesson(data);
  return (
    <div
      className={`quiz_container w-full max-w-6xl mx-auto px-2 sm:px-3 min-w-0 ${
        pageDir === "rtl" ? "font-naskh" : "font-sans"
      }`}
    >
      <LessonStatsBar
        direction={pageDir}
        questionCount={Array.isArray(data?.quizes) ? data.quizes.length : 0}
        timeContent={
          <CountDown
            quizEnd={quizEnd}
            hoursMinSecs={{
              hours: 0,
              minutes: data.time,
              seconds: 0,
            }}
          />
        }
        totalMark={data.total_mark}
      />

      <div className="mt-3 bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 rounded-2xl p-2 sm:p-3 shadow-lg ring-2 ring-white/30">
        <QuizTemplate
          quizes={Array.isArray(data?.quizes) ? data.quizes : []}
          id={data._id}
          hideParagraphSide={data.hideParagraphSide}
        />
      </div>
    </div>
  );
}

export default Quiz;
