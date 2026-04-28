import React, { useEffect, useState } from "react";
import Link from "next/link";
import cn from "classnames";

import MultipleChoice2 from "./multiple-choice2";
import MultipleChoice from "./multiple-choice";
import Reorder from "./reorder";
import MissingWord from "./missing-word";
import BlankSpace from "./blank-space";
import Highlight from "./highlight-word";
import Rearrange from "./rearrange";
import GroupSort from "./group-sort";
import Classification from "./classification";
import MathQuiz from "./math";
import LineConnect from "./line-connect";
import TrueFalse from "./true-false";
import ConsonantBlend from "./consonant-blend";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

function parseMark(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/** Lesson log may store spend_time as "m:s" or as { min, sec } from some clients. */
function formatSpendTimeDisplay(st) {
  if (st == null) return "—";
  if (typeof st === "string") return st;
  if (typeof st === "object" && !Array.isArray(st) && (st.min != null || st.sec != null)) {
    return `${st.min ?? 0}:${st.sec ?? 0}`;
  }
  return String(st);
}

function encouragementMessage(isRtl, ratio) {
  if (ratio >= 0.9) {
    return isRtl ? "أداء رائع! أنت نجم!" : "Super work — you’re a star!";
  }
  if (ratio >= 0.7) {
    return isRtl ? "أحسنت! واصل التعلم!" : "Great job — keep learning!";
  }
  if (ratio >= 0.5) {
    return isRtl ? "جيد! يمكنك التحسّن دائماً" : "Nice try — practice makes perfect!";
  }
  return isRtl
    ? "لا بأس، كل محاولة تعلّمك شيئاً جديداً"
    : "Every try helps you grow!";
}

function scoreTier(ratio) {
  if (ratio >= 0.9) {
    return {
      labelAr: "مستوى ممتاز",
      labelEn: "Outstanding",
      badgeClass:
        "border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 shadow-sm",
      barClass: "bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400",
      ringClass: "ring-amber-200/60",
    };
  }
  if (ratio >= 0.7) {
    return {
      labelAr: "أداء قوي",
      labelEn: "Strong work",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-900 shadow-sm",
      barClass: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500",
      ringClass: "ring-emerald-200/50",
    };
  }
  if (ratio >= 0.5) {
    return {
      labelAr: "في الطريق الصحيح",
      labelEn: "On the right track",
      badgeClass: "border-sky-200 bg-sky-50 text-sky-900 shadow-sm",
      barClass: "bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400",
      ringClass: "ring-sky-200/50",
    };
  }
  return {
    labelAr: "واصل المحاولة",
    labelEn: "Keep going",
    badgeClass: "border-violet-200 bg-violet-50 text-violet-900 shadow-sm",
    barClass: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400",
    ringClass: "ring-violet-200/40",
  };
}

const ValidateQuiz = ({ data }) => {
  const [barWidth, setBarWidth] = useState(0);

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
      case "word_bank":
        return <Rearrange quiz={item} idx={idx} />;
      case "group_sort":
        return <GroupSort quiz={item} idx={idx} />;
      case "classification":
        return <Classification quiz={item} idx={idx} />;
      case "math":
        return <MathQuiz quiz={item} idx={idx} />;
      case "line_connect":
        return <LineConnect quiz={item} idx={idx} />;
      case "true_false":
        return <TrueFalse quiz={item} idx={idx} />;
      case "consonant_blend":
        return <ConsonantBlend quiz={item} idx={idx} />;
      default:
        return (
          <p className="text-center text-amber-800">
            {type
              ? `Unsupported review: ${String(type)}`
              : "Invalid or missing question type."}
          </p>
        );
    }
  };

  const quizes = (data?.quizes ?? []).filter((q) => q != null);
  const quizTitleDirection = detectDirection(data?.title);
  const isRtl = quizTitleDirection === "rtl";
  const totalMark = parseMark(data?.total_mark);
  const obtainMark = parseMark(data?.obtain_mark);
  const scoreRatio = totalMark > 0 ? Math.min(1, Math.max(0, obtainMark / totalMark)) : 0;
  const scorePercent = Math.round(scoreRatio * 100);
  const encouragement = encouragementMessage(isRtl, scoreRatio);
  const tier = scoreTier(scoreRatio);
  const questionCount = quizes.length;

  // Scheherazade New for Question review: lesson title can be LTR but each quiz may be Arabic
  const naskhForQuestionReview =
    isRtl || quizes.some((q) => detectDirection(q?.title || "") === "rtl");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setBarWidth(scorePercent);
      return;
    }
    const id = requestAnimationFrame(() => setBarWidth(scorePercent));
    return () => cancelAnimationFrame(id);
  }, [scorePercent]);

  if (data == null) {
    return (
      <div className="container mx-auto min-h-[40vh] max-w-lg px-4 py-12 text-center text-slate-600">
        {`No result data to display.`}
      </div>
    );
  }

  return (
    <div
      dir={quizTitleDirection}
      className={cn(
        "min-h-screen bg-gradient-to-b from-slate-100 via-sky-50/80 to-amber-50/30 py-4 px-3 sm:px-4",
        isRtl ? "font-naskh font-bold" : "font-sans"
      )}
    >
      <div className="mx-auto max-w-5xl">
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-sky-400 to-amber-300 p-5 text-white shadow-2xl shadow-sky-900/20 ring-1 ring-white/30 sm:p-8`}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-amber-300/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-1/4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-teal-300/20 blur-2xl"
            aria-hidden
          />

          <div className="relative">
            <Text
              direction={quizTitleDirection}
              className="mb-6 text-2xl font-extrabold leading-tight tracking-tight drop-shadow-sm sm:text-3xl md:text-4xl"
            >
              {data?.title ?? "—"}
            </Text>

            <div
              className={`relative rounded-2xl border border-white/40 bg-white/95 p-5 text-slate-800 shadow-xl ring-2 ${tier.ringClass} backdrop-blur-sm sm:p-8`}
            >
              {scoreRatio >= 0.9 && (
                <div
                  className="pointer-events-none absolute -right-2 -top-2 text-3xl opacity-90 motion-reduce:opacity-60 sm:text-4xl"
                  aria-hidden
                >
                  ✨
                </div>
              )}

              <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-bold sm:text-base ${tier.badgeClass}`}
                >
                  {isRtl ? tier.labelAr : tier.labelEn}
                </span>
                <span
                  dir="ltr"
                  className="inline-flex min-w-[3.5rem] items-center justify-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-black tabular-nums text-slate-700 sm:text-base"
                >
                  {scorePercent}%
                </span>
              </div>

              <p className="text-center text-lg font-bold leading-snug text-sky-800 sm:text-xl">
                {encouragement}
              </p>

              <div className="my-6 flex flex-col items-center gap-2 sm:my-8">
                <span
                  dir="ltr"
                  className="flex items-baseline gap-2 tabular-nums tracking-tight"
                >
                  <span className="text-5xl font-black text-sky-600 sm:text-6xl md:text-7xl md:leading-none">
                    {obtainMark}
                  </span>
                  <span className="text-2xl font-bold text-slate-400 sm:text-3xl">
                    / {totalMark}
                  </span>
                </span>
                <span className="text-center text-base font-semibold text-slate-500 sm:text-lg">
                  {isRtl ? "نقاطك من المجموع" : "Your score out of total"}
                </span>
              </div>

              <div
                className="h-6 overflow-hidden rounded-full bg-slate-200/90 shadow-inner ring-1 ring-slate-200/80"
                role="progressbar"
                aria-valuenow={scorePercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={isRtl ? "نسبة النجاح" : "Score progress"}
              >
                <div
                  className={`h-full rounded-full motion-reduce:transition-none ${tier.barClass} shadow-sm transition-[width] duration-1000 ease-out motion-reduce:duration-0`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-slate-500 sm:text-base">
                {isRtl ? "كلما اقترب الشريط من النهاية، كانت نتيجتك أعلى" : "The fuller the bar, the higher your score"}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 text-base font-semibold sm:grid-cols-2 sm:gap-4 sm:text-lg lg:grid-cols-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3.5 shadow-md backdrop-blur-md transition duration-200 hover:border-white/35 hover:bg-white/25 hover:shadow-lg motion-reduce:transition-none">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/25 text-xl shadow-inner"
                  aria-hidden
                >
                  📚
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-bold uppercase tracking-wide text-white/85 sm:text-sm">
                    {isRtl ? "المادة" : "Subject"}
                  </span>
                  <span className="break-words text-white">
                    {data.subject === "arabic" ? "اللغة العربية" : data.subject}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3.5 shadow-md backdrop-blur-md transition duration-200 hover:border-white/35 hover:bg-white/25 hover:shadow-lg motion-reduce:transition-none">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/25 text-xl shadow-inner"
                  aria-hidden
                >
                  🎓
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-white/85 sm:text-sm">
                    {isRtl ? "الصَّف" : "Grade"}
                  </span>
                  <span className="text-white">{data.grade}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3.5 shadow-md backdrop-blur-md transition duration-200 hover:border-white/35 hover:bg-white/25 hover:shadow-lg motion-reduce:transition-none">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/25 text-xl shadow-inner"
                  aria-hidden
                >
                  ⏱️
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-white/85 sm:text-sm">
                    {isRtl ? "مدة الاختبار" : "Quiz length"}
                  </span>
                  <span className="text-white">
                    {data.time} {isRtl ? "دقيقة" : "min"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3.5 shadow-md backdrop-blur-md transition duration-200 hover:border-white/35 hover:bg-white/25 hover:shadow-lg motion-reduce:transition-none">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/25 text-xl shadow-inner"
                  aria-hidden
                >
                  ✨
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-white/85 sm:text-sm">
                    {isRtl ? "وقتك" : "Your time"}
                  </span>
                  <span className="text-white">
                    {formatSpendTimeDisplay(data.spend_time)} {isRtl ? "دقيقة" : "min"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/15 px-4 py-3.5 shadow-md backdrop-blur-md transition duration-200 hover:border-white/35 hover:bg-white/25 hover:shadow-lg motion-reduce:transition-none lg:col-span-1">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/25 text-xl shadow-inner"
                  aria-hidden
                >
                  🏆
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-white/85 sm:text-sm">
                    {isRtl ? "إجمالي النقاط" : "Total points"}
                  </span>
                  <span className="text-white">
                    {data.total_mark} {isRtl ? "درجة" : "pts"}
                  </span>
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur-md sm:p-5">
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-white/80 sm:text-sm">
                {isRtl ? "دليل الألوان في الأسئلة" : "Answer key below"}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-10">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-lg font-bold text-white shadow-md"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <p className="text-base font-bold sm:text-lg">
                    {isRtl ? "إجابة صحيحة" : "Correct"}
                  </p>
                </div>
                <div className="hidden h-8 w-px bg-white/30 sm:block" aria-hidden />
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-rose-500 text-lg font-bold text-white shadow-md"
                    aria-hidden
                  >
                    ✗
                  </span>
                  <p className="text-base font-bold sm:text-lg">
                    {isRtl ? "إجابة خاطئة" : "Incorrect"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-center text-base font-bold text-sky-700 shadow-lg transition hover:bg-sky-50 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isRtl ? "تصفح المزيد من الدروس" : "Explore more lessons"}
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-6 py-3.5 text-center text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isRtl ? "خطط الاشتراك" : "Membership plans"}
              </Link>
            </div>
          </div>
        </div>

        <section
          className={cn(
            "mt-8 rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white via-white to-slate-50/95 px-4 py-6 shadow-xl shadow-slate-200/40 sm:px-7 sm:py-8",
            naskhForQuestionReview && "font-naskh",
            // مكوّنات review تفرض font-sans في فرع LTR — نعيد Scheherazade New لكل العناصر
            naskhForQuestionReview && "[&_*]:!font-naskh"
          )}
          aria-labelledby="quiz-breakdown-heading"
        >
          <header className="mb-6 border-b border-slate-200/90 pb-5">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <div
                  className="mt-1 hidden h-16 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-sky-500 via-sky-400 to-amber-400 sm:block"
                  aria-hidden
                />
                <div>
                  <h2
                    id="quiz-breakdown-heading"
                    className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl"
                  >
                    {isRtl ? "مراجعة الأسئلة" : "Question review"}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                    {isRtl
                      ? questionCount === 1
                        ? "سؤال واحد أدناه. طابق ألوان إجابتك مع دليل الألوان أعلى الصفحة."
                        : `${questionCount} أسئلة أدناه. استخدم أرقام الانتقال السريع أو مرّر لمراجعة كل سؤال على حدة.`
                      : questionCount === 1
                        ? "One question below. Match the colors with the answer key at the top."
                        : `${questionCount} questions below. Use quick jump or scroll each card at your own pace.`}
                  </p>
                </div>
              </div>
              <div
                dir="ltr"
                className="flex shrink-0 items-center gap-2 self-start rounded-2xl bg-sky-50 px-4 py-3 ring-1 ring-sky-200/80"
              >
                <span className="text-xs font-bold uppercase tracking-wide text-sky-700/90">
                  {isRtl ? "الإجمالي" : "Total"}
                </span>
                <span className="text-2xl font-black tabular-nums text-sky-800">{questionCount}</span>
              </div>
            </div>

            {questionCount > 1 && (
              <nav
                className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/90 p-3 sm:p-4"
                aria-label={isRtl ? "انتقال سريع بين الأسئلة" : "Jump to a question"}
              >
                <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isRtl ? "انتقال سريع" : "Quick jump"}
                </p>
                <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto pr-1 sm:max-h-none">
                  {quizes.map((_, idx) => (
                    <a
                      key={`jump-${idx}`}
                      href={`#question-review-${idx}`}
                      className="inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center justify-center rounded-xl bg-white px-3 text-sm font-bold text-sky-800 shadow-sm ring-1 ring-slate-200/90 transition hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-md hover:ring-sky-300/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 motion-reduce:hover:translate-y-0"
                    >
                      {idx + 1}
                    </a>
                  ))}
                </div>
              </nav>
            )}
          </header>

          <div className="space-y-5 pb-1 sm:space-y-6">
            {quizes.map((item, idx) => (
              <article
                key={item?._id ?? `q-${idx}`}
                id={`question-review-${idx}`}
                tabIndex={-1}
                className="scroll-mt-28 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-100/90 transition-shadow hover:shadow-lg motion-reduce:transition-none sm:scroll-mt-36"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-sky-50/40 px-4 py-2.5 sm:px-5 sm:py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-sm font-black text-white shadow-md sm:h-10 sm:w-10">
                      {idx + 1}
                    </span>
                    <p className="text-xs font-semibold text-slate-700 sm:text-sm">
                      {isRtl ? `سؤال ${idx + 1} من ${questionCount}` : `Question ${idx + 1} of ${questionCount}`}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 ring-1 ring-slate-200/80 sm:text-xs">
                    {isRtl ? "مراجعة" : "Review"}
                  </span>
                </div>
                <div className="border-t border-slate-50 bg-white p-3 sm:p-5 md:p-6">
                  {quizLayout(item.type, item, idx)}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ValidateQuiz;
