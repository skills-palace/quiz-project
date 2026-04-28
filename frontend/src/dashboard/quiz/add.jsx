import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAddMutation } from "@/redux/api/quiz-api";
import Form from "./form";
import Alert from "@/ui/alert";
import { nanoid } from "nanoid";
import { buildAlternativeSequencesFromLines } from "./utils/alt-sequences";
import toast from "react-hot-toast";

const Add = () => {
  const [addQuiz, { isLoading, isSuccess, isError, error }] = useAddMutation();
  const router = useRouter();

  const pathname = usePathname();
  const defaultValues = {
    status: 1,
    type: "multiple_choice",
    quizes: [{ id: nanoid(), title: "", answer: false, mark: 0 }],
    alternativeOrderLines: [],
  };

  const onSubmitOthers = async (values) => {
    const lineObjects = values.alternativeOrderLines || [];
    const lineStrings = lineObjects
      .map((x) =>
        typeof x === "object" && x !== null && "line" in x
          ? x.line
          : x
      )
      .filter((s) => s != null && String(s).trim() !== "");

    let extraPayload = {};
    if (
      values.type === "word_bank" ||
      values.type === "rearrange" ||
      values.type === "reorder"
    ) {
      const built = buildAlternativeSequencesFromLines(
        lineStrings,
        values.quizes
      );
      if (built === null) {
        toast.error(
          "Check optional orderings: use the same words as above, comma‑separated, and the same number of words."
        );
        return;
      }
      extraPayload = { alternativeSequences: built };
    }

    const { audioPath, questionAudio, alternativeOrderLines, ...rest } = {
      ...values,
      ...extraPayload,
    };
    const formData = new FormData();

    // Append other form dataF
    for (const key in rest) {
      if (Array.isArray(rest[key])) {
        rest[key].forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            for (const subKey in item) {
              if (Array.isArray(item[subKey])) {
                // Append each element of the array individually
                item[subKey].forEach((subItem, subIndex) => {
                  formData.append(
                    `${key}[${index}][${subKey}][${subIndex}]`,
                    subItem
                  );
                });
              } else {
                formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
              }
            }
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else {
        formData.append(key, rest[key]);
      }
    }

    // Append the audio file if it exists
    if (audioPath && audioPath[0]) {
      formData.append("audioPath", audioPath[0]);
    }
    if (questionAudio && questionAudio[0]) {
      formData.append("questionAudio", questionAudio[0]);
    }
    try {
      const res = await addQuiz(formData).unwrap();
      const response = res.quiz;
      const searchParams = new URLSearchParams(window.location.search);
      const source = searchParams.get("source");

      if (source) {
        if (pathname.startsWith("/teacher")) {
          if (source.startsWith("teacher/lesson/edit")) {
            // Navigate back to the edit page with the quiz ID
            router.push(`/${source}?quiz=${response._id}`);
          } else if (source === "teacher/lesson/create") {
            // Navigate back to the create page with the quiz ID
            router.push(`/teacher/lesson/create?quiz=${response._id}`);
          } else {
            // Default to teacher's quiz list
            router.push("/teacher/quiz");
          }
        } else {
          if (source.startsWith("admin/lesson/edit")) {
            // Navigate back to the edit page with the quiz ID
            router.push(`/${source}?quiz=${response._id}`);
          } else if (source === "admin/lesson/create") {
            // Navigate back to the create page with the quiz ID
            router.push(`/admin/lesson/create?quiz=${response._id}`);
          } else {
            // Default to admin's quiz list
            router.push("/admin/quiz");
          }
        }
      } else {
        if (pathname.startsWith("/teacher")) {
          router.push("/teacher/quiz");
        } else {
          router.push("/admin/quiz");
        }
      }
    } catch (err) {
      console.error("Failed to save the quiz:", err);
    }
  };

  const onSubmit = async (values) => {
    const { audioPath, questionAudio, quizes, type, ...rest } = values;
    console.log(values);
    if (type !== "group_sort" && type !== "classification") {
      return onSubmitOthers(values);
    } else {
      const formData = new FormData();

      // Append the `type` field
      if (type) {
        formData.append("type", type);
      } else {
        console.error("Type is missing!");
        return;
      }

      // Append other form data
      for (const key in rest) {
        if (rest[key] !== undefined && rest[key] !== null) {
          formData.append(key, rest[key]);
        }
      }

      // Handle the `quizes` array
      if (Array.isArray(quizes)) {
        quizes.forEach((quiz, quizIndex) => {
          formData.append(`quizes[${quizIndex}][id]`, quiz.id);
          formData.append(`quizes[${quizIndex}][name]`, quiz.name);

          if (Array.isArray(quiz.items)) {
            quiz.items.forEach((item, itemIndex) => {
              if (type === "group_sort" || type === "classification") {
                // For `group_sort` or `classification` types, pass the item as an object
                formData.append(
                  `quizes[${quizIndex}][items][${itemIndex}][id]`,
                  item.id
                );
                formData.append(
                  `quizes[${quizIndex}][items][${itemIndex}][title]`,
                  item.title
                );
                formData.append(
                  `quizes[${quizIndex}][items][${itemIndex}][mark]`,
                  item.mark
                );
              } else {
                return;
              }
            });
          }
        });
      }

      // Append the audio file if it exists
      if (audioPath && audioPath[0]) {
        formData.append("audioPath", audioPath[0]);
      }
      if (questionAudio && questionAudio[0]) {
        formData.append("questionAudio", questionAudio[0]);
      }
      try {
        const res = await addQuiz(formData).unwrap();

        const response = res.quiz;
        const searchParams = new URLSearchParams(window.location.search);
        const source = searchParams.get("source");

        if (source) {
          if (pathname.startsWith("/teacher")) {
            if (source.startsWith("teacher/lesson/edit")) {
              // Navigate back to the edit page with the quiz ID
              router.push(`/${source}?quiz=${response._id}`);
            } else if (source === "teacher/lesson/create") {
              // Navigate back to the create page with the quiz ID
              router.push(`/teacher/lesson/create?quiz=${response._id}`);
            } else {
              // Default to teacher's quiz list
              router.push("/teacher/quiz");
            }
          } else {
            if (source.startsWith("admin/lesson/edit")) {
              // Navigate back to the edit page with the quiz ID
              router.push(`/${source}?quiz=${response._id}`);
            } else if (source === "admin/lesson/create") {
              // Navigate back to the create page with the quiz ID
              router.push(`/admin/lesson/create?quiz=${response._id}`);
            } else {
              // Default to admin's quiz list
              router.push("/admin/quiz");
            }
          }
        } else {
          if (pathname.startsWith("/teacher")) {
            router.push("/teacher/quiz");
          } else {
            router.push("/admin/quiz");
          }
        }
      } catch (err) {
        console.error("Failed to save the quiz:", err);
      }
    }
  };

  return (
    <div>
      {isError && (
        <Alert message={error?.data?.message ?? "Something went wrong"} />
      )}
      <Form
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        isLoading={isLoading}
        btnTitle="Save Quiz"
      />
    </div>
  );
};

export default Add;
