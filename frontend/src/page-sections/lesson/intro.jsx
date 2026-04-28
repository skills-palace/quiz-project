import React, { useRef, useCallback } from "react";
import { BtnBlue } from "@/dashboard/shared/btn";
import { safeHtmlToReact } from "@/utils/safeHtmlToReact";
import { setStage } from "@/redux/slices/lesson-slice";
import { useDispatch } from "react-redux";
import {
  detectDirection,
  layoutDirectionForLesson,
} from "@/utils/detectDirection";
import { Container, Text } from "@/components/StyledComponents";
import LessonStatsBar from "./LessonStatsBar";
import QuestionSpeechBar from "./quiz-template/QuestionSpeechBar";

const stripPreviewImages = (html = "") => html.replace(/<img\b[^>]*>/gi, "");

const Intro = ({ data }) => {
  const dispatch = useDispatch();
  const nativeAudioRef = useRef(null);
  const onNativeAudioPlay = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const sanitizedDescription = stripPreviewImages(data?.description || "");
  const descriptionDir = detectDirection(sanitizedDescription);
  const pageDir = layoutDirectionForLesson(data);

  return (
    <Container
      className={`w-full max-w-6xl mx-auto px-2 sm:px-3 min-w-0 ${
        pageDir === "rtl" ? "font-naskh" : "font-sans"
      }`}
    >
      <LessonStatsBar
        direction={pageDir}
        questionCount={Array.isArray(data?.quizes) ? data.quizes.length : 0}
        timeContent={data.time}
        totalMark={data.total_mark}
      />

      <div className="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 rounded-2xl shadow-xl p-3 sm:p-5 mt-2 space-y-4 ring-2 ring-white/30">
        <div className="grid place-items-center pt-1 pb-2">
          <BtnBlue
            className="!mt-0 w-full sm:w-auto max-w-md min-h-[3.25rem] px-6 sm:px-10 md:px-12 py-3.5 sm:py-4 text-lg sm:text-xl rounded-2xl shadow-lg !text-white"
            onClick={() => dispatch(setStage("quiz"))}
          >
            {pageDir === "rtl" ? (
              <span className="font-naskh font-bold text-xl text-white">🚀 ابدأ الاختبار</span>
            ) : (
              <span className="font-sans font-bold text-xl text-white">🚀 Start quiz</span>
            )}
          </BtnBlue>
        </div>

        <div className="px-0 sm:px-1">
          <QuestionSpeechBar
            html={sanitizedDescription}
            direction={descriptionDir}
            questionKey={`${data?._id || "lesson"}-intro`}
            nativeAudioRef={nativeAudioRef}
          />
        </div>

        {data?.audioPath && (
          <div className="flex justify-center mb-2 px-1">
            <audio
              ref={nativeAudioRef}
              className="border-2 border-white/80 rounded-2xl w-full max-w-lg min-h-[52px] bg-white/95"
              controlsList="nodownload"
              controls
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${data?.audioPath}`}
              onPlay={onNativeAudioPlay}
            />
          </div>
        )}

        <Text
          direction={descriptionDir}
          className={`
        ${
          descriptionDir === "rtl"
            ? "bg-white/95 p-4 sm:p-5 md:p-6 text-[1.2rem] sm:text-[1.35rem] md:text-[1.45rem] font-naskh indent-2 sm:indent-4 leading-[2.5rem] sm:leading-[2.75rem] md:leading-[3rem] text-justify overflow-y-auto lesson-intro-content"
            : "bg-white/95 p-4 sm:p-5 md:p-6 text-justify overflow-y-auto lesson-intro-content text-base sm:text-lg md:text-xl font-sans indent-2 leading-relaxed sm:leading-loose"
        } border-2 border-white/60 rounded-2xl shadow-inner`}
        >
          {sanitizedDescription && safeHtmlToReact(sanitizedDescription)}
        </Text>
      </div>
    </Container>
  );
};

export default Intro;
