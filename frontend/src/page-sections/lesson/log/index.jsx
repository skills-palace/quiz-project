import { useEffect } from "react";
import ValidateQuiz from "@/components/validate-template";
import { useGetLessonLogQuery, cacheClean } from "@/redux/api/lesson-api";

const LessonLog = ({ id }) => {
  const { data, isLoading, isError, isUninitialized } =
    useGetLessonLogQuery(id);

  useEffect(() => {
    return () => {
      cacheClean(["quiz-validate"]);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container loader_box" style={{ height: "100vh" }}>
        loading...
      </div>
    );
  }

  if (isError) return <p>something wrong</p>;

  return (
    <div className="">
      <ValidateQuiz data={data.result} />
    </div>
  );
};

export default LessonLog;
