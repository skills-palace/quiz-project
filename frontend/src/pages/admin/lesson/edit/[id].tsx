import React from "react";

import EditLesson from "@/dashboard/lesson/edit";
import Layout from "@/layout/dashboard";

const EditLessonPage = () => {
  return (
    <div>
      <h2 className="mb-1">Edit Lesson</h2>
      <EditLesson />
    </div>
  );
};

EditLessonPage.Layout = Layout;

export default EditLessonPage;
