import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  useUpdateMutation,
  useEditQuery,
  cacheClean,
} from "@/redux/api/lesson-api";
import Form from "./form";
import toast from "react-hot-toast";
import Loader from "@/ui/loader";
import Alert from "@/ui/alert";
import { usePathname } from "next/navigation";

const AddLesson = () => {
  const { isReady, query, replace } = useRouter();
  const {
    data = { result: {} },
    isUninitialized,
    isLoading,
    isError,
  } = useEditQuery({ id: query.id }, { skip: !isReady });

  const [updateLesson, updateOpt] = useUpdateMutation();

  const pathname = usePathname();

  const onSubmit = ({ quizes, imagePath, audioPath, ...formdata }) => {
    const quizInfo = quizes.reduce(
      (acc, ele) => {
        acc.total_mark += ele.total_mark;
        acc.ids.push(ele._id);
        return acc;
      },
      {
        total_mark: 0,
        ids: [],
      }
    );

    const updateData = {
      ...formdata,
      status: Number(formdata.status),
      hideParagraphSide: Number(formdata.hideParagraphSide),
      quizIds: quizInfo.ids.map((id) => id.toString()), // Convert ObjectId to string if necessary
      total_mark: quizInfo.total_mark,
    };

    const formData = new FormData();

    // Handle audioPath
    if (audioPath && audioPath.length > 0 && typeof audioPath[0] === "object") {
      formData.append("audioPath", audioPath[0]);
    } else if (audioPath) {
      updateData.audioPath = audioPath; // Use existing audioPath
    } else if (audioPath === "") {
      updateData.audioPath = "";
    }
    if (imagePath && imagePath.length > 0 && typeof imagePath[0] === "object") {
      // Handle imagePath
      formData.append("imagePath", imagePath[0]);
    } else if (imagePath) {
      updateData.imagePath = imagePath;
    } else if (imagePath === null) {
      updateData.imagePath = "";
    }

    // Append other form data
    Object.keys(updateData).forEach((key) => {
      if (Array.isArray(updateData[key])) {
        updateData[key].forEach((value) => formData.append(`${key}[]`, value));
      } else {
        formData.append(key, updateData[key]);
      }
    });

    // Call the update API
    if (formData.has("audioPath") || formData.has("imagePath")) {
      updateLesson({ id: query.id, formData });
    } else {
      updateLesson({ id: query.id, formData: updateData });
    }
  };

  useEffect(() => {
    if (updateOpt.isSuccess) {
      toast.success("Lesson updated successfully");

      if (pathname.startsWith("/teacher")) {
        replace("/teacher/lesson");
      } else {
        replace("/admin/lesson");
      }

      return () => {
        cacheClean(["edit-lesson"]);
      };
    }
  }, [updateOpt.isSuccess]);

  if (isUninitialized || isLoading) {
    return (
      <div className="rounded shadow-sm bg-white p-2 h-32 flex flex-col justify-center items-center">
        <Loader className="w-10 h-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded shadow-sm bg-white p-2">Something went wrong</div>
    );
  }

  const {
    title,
    total_mark,
    description,
    grade,
    skill,
    quizes,
    subject,
    audioPath,
    imagePath,
    time,
    status,
    hideParagraphSide,
  } = data.result;

  return (
    <div>
      {updateOpt.isError && (
        <Alert
          message={updateOpt.error?.data?.message ?? "Something went wrong"}
        />
      )}
      <Form
        onSubmit={onSubmit}
        defaultValues={{
          title,
          total_mark,
          grade,
          quizes,
          skill,
          subject,
          time,
          status,
          hideParagraphSide,
          description,
          imagePath,
          audioPath,
        }}
        btnTitle="Save"
        isLoading={updateOpt.isLoading}
      />
    </div>
  );
};

export default AddLesson;
