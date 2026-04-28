import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAddMutation } from "@/redux/api/lesson-api";
import Form from "./form";
import toast from "react-hot-toast";

const AddLesson = () => {
  const [addLesson, { isLoading, isSuccess, isError }] = useAddMutation();
  const router = useRouter();
  const pathname = usePathname();  // Get the current path

  const onSubmit = (formData) => {
    const { quizes, ...rest } = formData;

    // Create a new FormData object
    const data = new FormData();

    // Append other form fields to FormData
    Object.keys(rest).forEach((key) => {
      data.append(key, rest[key]);
    });

    // Calculate total mark and append quizIds one by one
    let totalMark = 0;
    quizes.forEach((quiz) => {
      totalMark += quiz.total_mark;
      data.append('quizIds', quiz._id);  // Append each ObjectId directly
    });
    data.append('total_mark', totalMark);

    // Append files (if any)
    if (rest.audioPath && rest.audioPath.length > 0) {
      Array.from(rest.audioPath).forEach((file) => {
        data.append('audioPath', file);
      });
    }
    if (rest.imagePath && rest.imagePath.length > 0) {
      Array.from(rest.imagePath).forEach((file) => {
        data.append('imagePath', file);
      });
    }

    // Call the mutation function
    addLesson(data);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success("Lesson added successfully");

      if (pathname.startsWith("/teacher")) {
        router.push("/teacher/lesson");
      } else {
        router.push("/admin/lesson");
      }
    }
  }, [isSuccess, pathname, router]);

  /** New lessons default to hiding the question paragraph panel; admin/teacher can set "show". */
  const defaultValues = {
    hideParagraphSide: "1",
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        btnTitle="Save"
        isLoading={isLoading}
        defaultValues={defaultValues}
      />
    </div>
  );
};

export default AddLesson;
