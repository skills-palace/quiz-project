import React from "react";

import MultipleChoice2 from "./multiple-choice2";
import MultipleChoice from "./multiple-choice";
import Reorder from "./reorder";
import MissingWord from "./missing-word";
import BlankSpace from "./blank-space";
import Highlight from "./highlight-word";
import Rearrange from "./rearrange";
import GroupSort from "./group-sort";
import Classification from "./classification";
import Math from "./math";
import LineConnect from "./line-connect";
import TrueFalse from "./true-false";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

const ValidateQuiz = ({ data }) => {
  const quizLayout = (type, item, idx) => {
    switch (type) {
      case "multiple_choice2":
        return <MultipleChoice2 quiz={item} idx={idx} />;
      case "multiple_choice":
        return <MultipleChoice quiz={item} idx={idx} />;
      case "reorder":
        return <Reorder quiz={item} idx={idx} />;
      case "missing_word":
        return <MissingWord quiz={item} idx={idx} />;
      case "blank_space":
        return <BlankSpace quiz={item} idx={idx} />;
      case "highlight_word":
        return <Highlight quiz={item} idx={idx} />;
      case "rearrange":
        return <Rearrange quiz={item} idx={idx} />;
      case "group_sort":
        return <GroupSort quiz={item} idx={idx} />;
      case "classification":
        return <Classification quiz={item} idx={idx} />;
      case "math":
        return <Math quiz={item} idx={idx} />;
      case "line_connect":
        return <LineConnect quiz={item} idx={idx} />;
      case "true_false":
        return <TrueFalse quiz={item} idx={idx} />;
    }
  };

  const quizTitleDirection = detectDirection(data.title);

  return (
    <div dir={quizTitleDirection} className="py-8 px-6 bg-gradient-to-r from-gray-100 to-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-500 via-sky-400 to-blue-300 text-white rounded-xl shadow-lg p-8 mb-10">
        <Text
          direction={quizTitleDirection}
          className="text-3xl font-extrabold tracking-tight mb-6"
        >
          {data.title}
        </Text>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-medium">
          <div className="flex items-center">
            <span className="font-semibold mr-2">
              {quizTitleDirection === "rtl" ? "المادة" : "Subject"}:
            </span>
            <span>
              {data.subject === "arabic" ? "اللغة العربية" : data.subject}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">
              {quizTitleDirection === "rtl" ? "الصَّف" : "Grade"}:
            </span>
            {data.grade}
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">
              {quizTitleDirection === "rtl" ? "مدة الاختبار" : "Total Time"}:
            </span>
            {data.time} {quizTitleDirection === "rtl" ? "دقيقة" : "m"}
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">
              {quizTitleDirection === "rtl" ? "الوقت" : "Spend Time"}:
            </span>
            {data.spend_time} {quizTitleDirection === "rtl" ? "دقيقة" : "m"}
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">
              {quizTitleDirection === "rtl" ? "درجة الاختبار" : "Total Mark"}:
            </span>
            {data.total_mark} {quizTitleDirection === "rtl" ? "درجة" : "Points"}
          </div>
          <div className="flex items-center">
            <span className="font-semibold mr-2">
              {quizTitleDirection === "rtl" ? "العلامة" : "Obtain Mark"}:
            </span>
            {data.obtain_mark} {quizTitleDirection === "rtl" ? "درجة" : "Points"}
          </div>
        </div>
        <div className="flex justify-start items-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <div className="bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
            <p className="text-lg font-semibold">
              {quizTitleDirection === "rtl"
                ? "الإجابة الصحيحة"
                : "Right Answer"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-500 w-5 h-5 rounded-full border-2 border-white"></div>
            <p className="text-lg font-semibold">
              {quizTitleDirection === "rtl"
                ? "الإجابة الخاطئة"
                : "Wrong Answer"}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {data?.quizes?.map((item, idx) => (
          <div
            key={idx}
            className="bg-white shadow-xl rounded-lg p-6 border-t-4 border-blue-500 hover:shadow-2xl transition duration-300"
          >
            {quizLayout(item.type, item, idx)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValidateQuiz;
