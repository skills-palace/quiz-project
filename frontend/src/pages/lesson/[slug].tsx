import Layout from "@/layout/site";
import Lesson from "@/page-sections/lesson";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStage, clean } from "@/redux/slices/lesson-slice";
import { cacheClean } from "@/redux/api/lesson-api";

import { layoutDirectionForLesson } from "@/utils/detectDirection";
import LessonErrorBoundary from "@/components/LessonErrorBoundary";

const LessonPage = ({ data }: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setStage("intro"));
      dispatch(clean(""));
      cacheClean(["quiz-validate"]);
    };
  }, []);

  if (data.isError) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-xl font-bold text-rose-700 font-naskh mb-2">حدث خطأ</p>
        <p className="text-slate-700">{data.error}</p>
      </div>
    );
  }

  const pageDir = layoutDirectionForLesson(data.result);

  return (
    <div
      dir={pageDir}
      className={`min-h-fit bg-gradient-to-b from-sky-100 via-sky-50 to-indigo-50/90 pb-8 pb-[max(2rem,env(safe-area-inset-bottom,0px))] ${
        pageDir === "rtl" ? "font-naskh" : "font-sans"
      }`}
    >
      <LessonErrorBoundary>
        <Lesson data={data.result} />
      </LessonErrorBoundary>
    </div>
  );
};

LessonPage.Layout = Layout;

export const getServerSideProps = async (ctx: any) => {
  const slug = ctx.query.slug;
  const data: {
    result: any;
    isError: boolean;
    error: string | null;
  } = { result: {}, isError: false, error: null };

  try {
    const res = await axios.get(`${process.env.BASE_URL}/api/lesson/${slug}`);
    const result = res.data?.result;
    if (result == null) {
      data.isError = true;
      data.error = "No lesson data";
    } else {
      data.result = result;
    }
  } catch (err: any) {
    data.isError = true;
    data.error = err?.response?.data?.message ?? "something wrong";
  }
  return {
    props: { data },
  };
};

export default LessonPage;
