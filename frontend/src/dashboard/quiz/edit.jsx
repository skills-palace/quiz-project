import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  useUpdateMutation,
  useEditQuery,
  cacheClean,
} from "@/redux/api/quiz-api";
import Form from "./form";
import toast from "react-hot-toast";
import Loader from "@/ui/loader";
import Alert from "@/ui/alert";
import { usePathname } from "next/navigation";
import { buildAlternativeSequencesFromLines, alternativeSequencesToLines } from "./utils/alt-sequences";
const AddLesson = () => {
  const { isReady, query, replace } = useRouter();
  const {
    data = { result: {} },
    isUninitialized,
    isLoading,
    isError,
    error,
  } = useEditQuery({ id: query.id }, { skip: !isReady });

  const [updateQuiz, updateOpt] = useUpdateMutation();

  // State to track if the audio files have been removed
  const [audioRemoved, setAudioRemoved] = useState(false);
  const [questionAudioRemoved, setQuestionAudioRemoved] = useState(false);

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

    // Append other form data
    for (const key in rest) {
      if (Array.isArray(rest[key])) {
        rest[key].forEach((item, index) => {
          if (typeof item === "object" && item !== null) {
            for (const subKey in item) {
              if (Array.isArray(item[subKey])) {
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

    // Append the audio file if it exists and hasn't been removed
    if (audioRemoved) {
      formData.append("audioPath", ""); // Send null if audio was removed
    } else if (audioPath && audioPath[0]) {
      formData.append("audioPath", audioPath[0]);
    }

    // Append the question audio file if it exists and hasn't been removed
    if (questionAudioRemoved) {
      formData.append("questionAudio", ""); // Send null if question audio was removed
    } else if (questionAudio && questionAudio[0]) {
      formData.append("questionAudio", questionAudio[0]);
    }

    try {
      await updateQuiz({
        id: query.id,
        formData,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update the quiz:", err);
    }
  };

  const onSubmit = async (values) => {
    const { audioPath, questionAudio, quizes, type, ...rest } = values;

    if (type !== "group_sort" && type !== "classification") {
      return onSubmitOthers(values);
    }

    const formData = new FormData();

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

    // Handle the quizes array
    if (Array.isArray(quizes)) {
      quizes.forEach((quiz, quizIndex) => {
        formData.append(`quizes[${quizIndex}][id]`, quiz.id);
        formData.append(`quizes[${quizIndex}][name]`, quiz.name);

        if (Array.isArray(quiz.items)) {
          quiz.items.forEach((item, itemIndex) => {
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
          });
        }
      });
    }

    // Append the audio file if it exists and hasn't been removed
    if (audioRemoved) {
      formData.append("audioPath", ""); // Send an empty string if audio was removed
    } else if (audioPath && audioPath[0]) {
      formData.append("audioPath", audioPath[0]);
    }

    // Append the question audio file if it exists and hasn't been removed
    if (questionAudioRemoved) {
      formData.append("questionAudio", ""); // Send an empty string if question audio was removed
    } else if (questionAudio && questionAudio[0]) {
      formData.append("questionAudio", questionAudio[0]);
    }

    try {
      await updateQuiz({
        id: query.id,
        formData,
      }).unwrap();
    } catch (err) {
      console.error("Failed to update the quiz:", err);
    }
  };

  const handleRemoveAudio = () => {
    setAudioRemoved(true); // Mark audio as removed
  };

  const handleRemoveAudioQuestion = () => {
    setQuestionAudioRemoved(true); // Mark question audio as removed
  };

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (updateOpt.isSuccess) {
      toast.success("Quiz updated successfully");
      if (pathname.startsWith("/teacher")) {
        router.push("/teacher/quiz");
      } else {
        router.push("/admin/quiz");
      }
    }
  }, [updateOpt.isSuccess]);

  if (isUninitialized || isLoading) {
    return (
      <div className="rounded shadow-sm bg-white p-2 h-20 flex flex-col justify-center items-center">
        <Loader className="w-10 h-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded shadow-sm bg-white p-2 h-20 flex flex-col justify-center items-center">
        <Alert message={error?.data?.message ?? "Something went wrong"} />
      </div>
    );
  }

  const { title, status, raw, type, description, audioPath, questionAudio, alternativeSequences } =
    data.result;

  const quizesForForm =
    type === "consonant_blend" && Array.isArray(raw)
      ? raw.map((q) => {
          const { wrong1, wrong2, ...rest } = q;
          let wrongBlends = rest.wrongBlends ?? "";
          if (!String(wrongBlends).trim() && (wrong1 || wrong2)) {
            wrongBlends = [wrong1, wrong2].filter(Boolean).join(", ");
          }
          return { ...rest, wrongBlends };
        })
      : raw;

  const altLines =
    type === "word_bank" || type === "rearrange" || type === "reorder"
      ? alternativeSequencesToLines(
          Array.isArray(alternativeSequences) ? alternativeSequences : [],
          Array.isArray(quizesForForm) ? quizesForForm : []
        ).map((line) => ({ line }))
      : [];

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
          quizes: quizesForForm,
          audioPath,
          questionAudio, // Include question audio in default values
          description,
          type,
          status,
          alternativeOrderLines: altLines,
        }}
        btnTitle="Update Quiz"
        isLoading={isLoading}
        onRemoveQuestionAudio={handleRemoveAudioQuestion} // Hook the question audio removal action
        onRemoveAudio={handleRemoveAudio} // Hook the audio removal action
      />
    </div>
  );
};

export default AddLesson;
