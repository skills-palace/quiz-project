import React from "react";

import EditQuiz from "@/dashboard/quiz/edit";
import Layout from "@/layout/dashboard";

const EditLessonPage = () => {
  return (
    <div>
      <h2 className="mb-1">Edit Quiz</h2>
      <EditQuiz />
    </div>
  );
};

EditLessonPage.Layout = Layout;

export default EditLessonPage;
