import React, { useEffect, useState } from "react";
import { Label, Input, ErrorMessage, Select } from "@/ui/hook-form";
import TextEditor from "@/ui/hook-form/text-editor";
import { useForm } from "react-hook-form";
import Quizes from "./quizes";
import { BtnBlue } from "@/dashboard/shared/btn";
import { BASE_URL } from "@/config/urls";
import SkillSelect from "./SkillSelect";
import ImageSelector from "./imageSelecter";
import Link from "next/link";
import { CiCirclePlus } from "react-icons/ci";
import { useRouter } from "next/router";

const Form = ({ onSubmit, defaultValues, btnTitle, isLoading }) => {
  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    shouldUnregister: true,
    mode: "all",
    defaultValues,
  });

  const [selectedSkills, setSelectedSkills] = useState();

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
    console.log(selectedOptions);
    setValue("skill", selectedOptions.value);
  };

  useEffect(() => {
    if (defaultValues?.skill) {
      // const skill = createOptionObject(defaultValues?.skill);
      setSelectedSkills({
        value: defaultValues.skill._id,
        label: defaultValues.skill.skill,
      });
    }
  }, [defaultValues?.skill]);

  const [audioFile, setAudioFile] = useState(defaultValues?.audioPath || null);
  const [replaceFile, setReplaceFile] = useState(false);

  const handleDeleteAudio = () => {
    setAudioFile(null);
    setReplaceFile(true); // Mark the file for replacement
    setValue("audioPath", ""); // Clear the audioPath value in the form
  };
  const [selectedImage, setSelectedImage] = useState(
    defaultValues?.imagePath || null
  );

  const handleImageChange = (imageFile) => {
    setSelectedImage(imageFile);
    setValue("imagePath", imageFile); // Update the form value
  };
  const router = useRouter();

  const handleCreateQuiz = async () => {
    // Get the current form state
    const formState = watch();

    // Save the form state in localStorage
    localStorage.setItem("lessonFormState", JSON.stringify(formState));

    const currentPath = router.pathname;
    console.log(currentPath);
    const isAdmin = currentPath.includes("admin");
    if (!isAdmin) {
      const isEditMode = currentPath.includes("teacher/lesson/edit");
      const source = isEditMode
        ? `teacher/lesson/edit/${router.query.id}`
        : "teacher/lesson/create";

      // Navigate to quiz creation page with the dynamic source
      router.push(`/teacher/quiz/create?source=${source}`);
    } else {
      const isEditMode = currentPath.includes("admin/lesson/edit");
      const source = isEditMode
        ? `admin/lesson/edit/${router.query.id}`
        : "admin/lesson/create";

      // Navigate to quiz creation page with the dynamic source
      router.push(`/admin/quiz/create?source=${source}`);
    }
  };

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("lessonFormState"));
    if (savedState) {
      // Populate the form with the saved state
      Object.keys(savedState).forEach((key) => {
        setValue(key, savedState[key]);
      });

      // Optionally, clear the saved state to avoid reusing old data
      localStorage.removeItem("lessonFormState");
    }
  }, [setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded shadow-sm bg-white p-2">
        <div className="my-3">
          <Label htmlFor="title">Title</Label>
          <Input
            register={register("title", {
              required: "title is required",
              maxLength: {
                value: 70,
                message: "title not more that 70 charecter",
              },
            })}
            invalid={errors.title}
            type="text"
            id="title"
            placeholder="Product title here..."
          />
          <ErrorMessage error={errors.title} />
        </div>
        <div className="flex my-2 gap-4">
          <div className="w-1/5">
            <Label htmlFor="subject">Language</Label>
            <Select
              register={register("subject")}
              error={errors.time}
              id="subject"
            >
              <option value="english">English</option>
              <option value="french">French</option>
              <option value="spanish">Spanish</option>
              <option value="arabic">Arabic</option>
            </Select>
            <ErrorMessage error={errors.subject} />
          </div>
          <div className="w-1/5">
            <Label htmlFor="grade">grade</Label>
            <Select register={register("grade")} error={errors.time} id="grade">
              <option value="All-Grades">All-Grades</option>
              <option value="K">K</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
              <option value="5th">5th</option>
              <option value="6th">6th</option>
              <option value="7th">7th</option>
              <option value="8th">8th</option>
            </Select>
            <ErrorMessage error={errors.subject} />
          </div>
          <div className="w-1/5">
            <Label htmlFor="time">Total Time</Label>
            <Input
              register={register("time", {
                valueAsNumber: true,
                required: "time is required",
                validate: (value) =>
                  value > 60 ? "time not more than 60 minutes" : true,
              })}
              invalid={errors.time}
              type="number"
              id="time"
              placeholder="quiz total time..."
            />
            <ErrorMessage error={errors.time} />
          </div>
          <div className="w-1/5">
            <Label htmlFor="status">Status</Label>
            <Select register={register("status")} id="status">
              <option value="1">active</option>
              <option value="0">inactive</option>
            </Select>
          </div>
          <div className="w-1/5">
            <Label htmlFor="hideParagraphSide">Paragraph Side</Label>
            <Select register={register("hideParagraphSide")} id="hideParagraphSide">
              <option value="0">show</option>
              <option value="1">hide</option>
            </Select>
          </div>
        </div>
        <SkillSelect value={selectedSkills} onChange={handleSkillChange} />
        <div className="flex items-center gap-5">
          {" "}
          {/* Image Selector */}
          <ImageSelector
            defaultImage={
              selectedImage
                ? `${process.env.NEXT_PUBLIC_BASE_URL}/${selectedImage}`
                : null
            }
            onImageChange={handleImageChange}
          />
          <div>
            <button
              type="button"
              onClick={handleCreateQuiz}
              className="flex text-gray-800 flex-col w-max items-center"
            >
              <CiCirclePlus className="text-4xl" />
              Create Quiz
            </button>
          </div>
        </div>
        <div className="my-3">
          <Label htmlFor="audioPath">Upload Audio</Label>
          {audioFile && !replaceFile ? (
            <div className="flex items-center gap-4">
              <audio
                controls
                src={`${process.env.NEXT_PUBLIC_BASE_URL}/${audioFile}`}
              />
              <button
                type="button"
                onClick={handleDeleteAudio}
                className="text-red-500 underline"
              >
                Remove Audio
              </button>
            </div>
          ) : (
            <Input
              register={register("audioPath")}
              invalid={errors.audioPath}
              type="file"
              id="audioPath"
              accept="audio/*"
            />
          )}
          <ErrorMessage error={errors.audioPath} />
        </div>
      </div>
      <Quizes control={control} />
      <div className="mt-4">
        <p>Description</p>
        <TextEditor control={control} name="description" />
      </div>
      <div className="mt-4 rounded shadow-sm bg-white p-2">
        <div className="text-end">
          <BtnBlue type="submit">{isLoading ? "loading" : btnTitle}</BtnBlue>
        </div>
      </div>
    </form>
  );
};

export default Form;
