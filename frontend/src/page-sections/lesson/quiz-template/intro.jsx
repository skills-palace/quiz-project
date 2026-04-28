import React from "react";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";
import { safeHtmlToReact } from "@/utils/safeHtmlToReact";

const stripPreviewImages = (html = "") => html.replace(/<img\b[^>]*>/gi, "");

function QuizIntro({ data }) {
  const sanitizedData = stripPreviewImages(data || "");
  const direction = detectDirection(sanitizedData);

  return (
    <Text
      direction={direction}
      className={`${
        direction === "rtl"
          ? "bg-sky-50/90 border-2 border-sky-100 rounded-2xl p-4 pt-5 shadow-inner overflow-y-auto h-fit mt-0 text-justify text-[1.35rem] sm:text-[1.45rem] font-naskh indent-4 leading-[2.85rem] sm:leading-[3.1rem] font-medium"
          : "bg-sky-50/90 border-2 border-sky-100 rounded-2xl p-4 pt-5 shadow-inner overflow-y-auto h-fit text-lg sm:text-xl font-sans indent-2 leading-relaxed sm:leading-loose text-justify"
      }`}
    >
      {sanitizedData && safeHtmlToReact(sanitizedData)}
    </Text>
  );
}

export default QuizIntro;
