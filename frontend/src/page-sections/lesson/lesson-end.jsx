import { useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useValiateQuizMutation } from "@/redux/api/lesson-api";
import ValidateQuiz from "@/components/validate-template";
import intervalToDuration from "date-fns/intervalToDuration";

function isSubscriptionExpiredError(error) {
  const msg =
    error?.data?.message ??
    error?.data?.data?.message ??
    error?.message ??
    "";
  return (
    typeof msg === "string" &&
    (msg.includes("Explorer trial has ended") || msg.includes("Upgrade to submit"))
  );
}

const LessonEnd = ({ id}) => {
  const { answers, startTime } = useSelector(({ lesson }) => lesson);

  const [validate, { data, isLoading, isError, isUninitialized, error }] =
    useValiateQuizMutation();

  useEffect(() => {
    const spendTime = intervalToDuration({ start: startTime, end: Date.now() });

    validate({
      id,
      answers,
      spend_time: {  min: spendTime.minutes, sec: spendTime.seconds },
    });
  }, []);

  return isUninitialized || isLoading ? (
    <div
      className="container flex min-h-[50vh] flex-col items-center justify-center gap-6 rounded-2xl bg-gradient-to-b from-sky-50 via-amber-50/50 to-white px-4 py-14"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-end gap-2" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-4 w-4 animate-bounce rounded-full bg-amber-400 shadow-sm"
            style={{ animationDelay: `${i * 120}ms`, animationDuration: "0.9s" }}
          />
        ))}
      </div>
      <div
        className="h-16 w-16 rounded-full border-[5px] border-sky-200 border-t-sky-600 animate-spin"
        aria-hidden
      />
      <p className="max-w-md text-center text-xl font-bold leading-snug text-slate-800 sm:text-2xl">
        Almost there! We’re adding up your score…
      </p>
      <p className="text-center text-base text-slate-600 sm:text-lg">
        Just a moment — great job finishing the quiz!
      </p>
    </div>
  ) : isError ? (
    isSubscriptionExpiredError(error) ? (
      <div className="container max-w-lg mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-xl font-bold text-rose-800 font-sans">
          Trial ended — results not saved
        </p>
        <p className="text-slate-600 font-sans text-sm leading-relaxed">
          Your Explorer trial has ended. Upgrade to the Learner plan to submit quizzes and keep
          progress. You can still browse lessons anytime.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/contact-us"
            className="inline-flex items-center rounded-lg bg-rose-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-800"
          >
            Contact us to upgrade
          </Link>
          <Link
            href="/membership"
            className="inline-flex items-center rounded-lg border border-rose-300 bg-white px-4 py-2 text-sm font-semibold text-rose-900 hover:bg-rose-50"
          >
            View membership plans
          </Link>
        </div>
      </div>
    ) : (
      <div className="container px-4 py-12 text-center">
        <p className="text-xl font-bold text-rose-700 font-naskh mb-2">تعذر إظهار النتيجة</p>
        <p className="text-slate-600 font-sans">Something went wrong. Please try again.</p>
      </div>
    )
  ) : (
    <div className="container pb-8">
      <ValidateQuiz data={data.result} />
    </div>
  );
};

export default LessonEnd;
