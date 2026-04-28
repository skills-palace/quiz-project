import { useGetMyLessonLogQuery } from "@/redux/api/lesson-api";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Layout from "@/layout/site";
import { useSelector } from "react-redux";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaPuzzlePiece, FaPencilAlt, FaStar } from "react-icons/fa";
import _truncate from "lodash/truncate";
import ValidateQuiz from "@/components/validate-template";
import { Select } from "@/ui/hook-form";

function parseNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const formattedDate = date.toISOString().slice(0, 10);
  const formattedTime = date.toTimeString().split(" ")[0];
  return `${formattedDate} ${formattedTime}`;
}

function mapQuizzesToRows(quizzes) {
  return quizzes.map((quiz) => {
    const total = parseNum(quiz.total_mark);
    const obtain = parseNum(quiz.obtain_mark);
    const ratio = total > 0 ? Math.min(1, Math.max(0, obtain / total)) : 0;
    return {
      title: quiz?.title,
      totalMark: quiz.total_mark,
      obtainMark: quiz.obtain_mark,
      dateTime: formatDateTime(quiz.createdAt),
      perfect: obtain === total && total > 0,
      ratio,
      percent: Math.round(ratio * 100),
      _id: quiz.lesson,
      data: quiz,
    };
  });
}

function encouragementForScore(ratio, perfect) {
  if (perfect) return { text: "Perfect score!", emoji: "🌟", tone: "emerald" };
  if (ratio >= 0.9) return { text: "Super work!", emoji: "⭐", tone: "sky" };
  if (ratio >= 0.7) return { text: "Great job!", emoji: "👏", tone: "teal" };
  if (ratio >= 0.5) return { text: "Nice try!", emoji: "💪", tone: "amber" };
  return { text: "Keep learning!", emoji: "📚", tone: "violet" };
}

export default function Analysis() {
  const { data = {}, isError, isFetching, isLoading } = useGetMyLessonLogQuery();
  const [tableData, setTableData] = useState([]);
  const [grade, setGrade] = useState("All-Grades");
  const [dateRange, setDateRange] = useState("this year");
  const [subject, setSubject] = useState("All subjects");
  const [filterBusy, setFilterBusy] = useState(false);

  const sourceList = data?.result;

  useEffect(() => {
    if (!sourceList) {
      setTableData([]);
      return;
    }
    setTableData(mapQuizzesToRows(sourceList));
  }, [sourceList]);

  const applyFilters = useCallback(() => {
    if (!sourceList?.length) {
      setTableData([]);
      return;
    }
    setFilterBusy(true);
    let filteredData = [...sourceList];

    if (subject !== "All subjects") {
      filteredData = filteredData.filter((quiz) => quiz.subject === subject);
    }

    if (grade !== "All-Grades") {
      filteredData = filteredData.filter((quiz) => quiz.grade === grade);
    }

    const now = new Date();
    if (dateRange === "last 7 days") {
      const pastWeek = new Date(now);
      pastWeek.setDate(pastWeek.getDate() - 7);
      filteredData = filteredData.filter((quiz) => new Date(quiz.createdAt) >= pastWeek);
    } else if (dateRange === "last 30 days") {
      const pastMonth = new Date(now);
      pastMonth.setDate(pastMonth.getDate() - 30);
      filteredData = filteredData.filter((quiz) => new Date(quiz.createdAt) >= pastMonth);
    } else if (dateRange === "this year") {
      const currentYear = new Date().getFullYear();
      filteredData = filteredData.filter(
        (quiz) => new Date(quiz.createdAt).getFullYear() === currentYear
      );
    }

    setTableData(mapQuizzesToRows(filteredData));
    setFilterBusy(false);
  }, [sourceList, subject, grade, dateRange]);

  const resetFilters = () => {
    setGrade("All-Grades");
    setDateRange("this year");
    setSubject("All subjects");
    if (sourceList?.length) {
      setTableData(mapQuizzesToRows(sourceList));
    } else {
      setTableData([]);
    }
  };

  const auth = useSelector(({ app }) => app.auth);
  const username = _truncate(auth.user?.username || "Explorer", { length: 16 });

  const calculateStats = (list) => {
    if (!list?.length) {
      return { answeredQuestions: 0, timeSpent: "0 min 0 sec", quizzesProgressed: 0 };
    }
    let answeredQuestions = 0;
    let totalTimeSpent = 0;

    list.forEach((quiz) => {
      answeredQuestions += quiz.quizes?.length || 0;
      const raw = quiz.spend_time;
      if (typeof raw === "string" && raw.includes(":")) {
        const timeParts = raw.split(":");
        const minutes = parseInt(timeParts[0], 10) || 0;
        const seconds = parseInt(timeParts[1], 10) || 0;
        totalTimeSpent += minutes * 60 + seconds;
      }
    });

    const min = Math.floor(totalTimeSpent / 60);
    const sec = totalTimeSpent % 60;
    return {
      answeredQuestions,
      timeSpent: `${min} min ${sec} sec`,
      quizzesProgressed: list.length,
    };
  };

  const stats = useMemo(() => calculateStats(sourceList || []), [sourceList]);

  const pageLoading = isLoading || isFetching || filterBusy;

  const selectClass =
    "w-full min-h-[48px] rounded-xl border-2 border-sky-100 bg-white px-3 text-base font-semibold text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200";

  return (
    <>
      <Head>
        <title>My progress & quiz history | Skills Palace</title>
        <meta
          name="description"
          content="See your quiz scores, time spent, and review your answers in a kid-friendly way."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-amber-50/30 to-white px-3 py-6 sm:px-5 sm:py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Hero */}
          <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500 via-sky-400 to-amber-300 p-6 text-white shadow-xl sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-white/90">
                  Hello
                </p>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {username}
                </h1>
                <p className="mt-2 max-w-xl text-base font-medium leading-relaxed text-white/95 sm:text-lg">
                  Here’s your learning journey — every quiz makes you stronger!
                </p>
              </div>
              <div
                className="mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-inner sm:mt-0"
                aria-hidden
              >
                🎯
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 rounded-2xl bg-white/95 p-4 text-slate-800 shadow-inner sm:p-5">
              <p className="mb-3 text-sm font-bold text-sky-800 sm:text-base">
                Find your quizzes
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-600">
                  Subject
                  <Select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={selectClass}
                  >
                    <option value="All subjects">All subjects</option>
                    <option value="english">English</option>
                    <option value="french">French</option>
                    <option value="spanish">Spanish</option>
                    <option value="arabic">Arabic</option>
                  </Select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-600">
                  Grade
                  <Select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className={selectClass}
                  >
                    {[
                      "All-Grades",
                      "K",
                      "1st",
                      "2nd",
                      "3rd",
                      "4th",
                      "5th",
                      "6th",
                      "7th",
                      "8th",
                      "9th",
                      "10th",
                      "11th",
                      "12th",
                    ].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-bold text-slate-600">
                  When
                  <Select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className={selectClass}
                  >
                    <option value="last 7 days">Last 7 days</option>
                    <option value="last 30 days">Last 30 days</option>
                    <option value="this year">This year</option>
                  </Select>
                </label>
                <div className="flex flex-col justify-end gap-2 sm:flex-row sm:items-end lg:flex-col">
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="min-h-[48px] rounded-xl bg-emerald-500 px-4 text-base font-bold text-white shadow-md transition hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    Apply filters
                  </button>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="min-h-[48px] rounded-xl border-2 border-slate-200 bg-slate-50 px-4 text-base font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Stats */}
          <section aria-label="Your stats" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                icon: <FaPencilAlt className="text-3xl text-sky-500 sm:text-4xl" />,
                label: "Questions you answered",
                value: stats.answeredQuestions,
                bg: "from-sky-50 to-white",
              },
              {
                icon: <AiOutlineClockCircle className="text-3xl text-teal-500 sm:text-4xl" />,
                label: "Time on quizzes",
                value: stats.timeSpent,
                bg: "from-teal-50 to-white",
              },
              {
                icon: <FaPuzzlePiece className="text-3xl text-amber-500 sm:text-4xl" />,
                label: "Quizzes finished",
                value: stats.quizzesProgressed,
                bg: "from-amber-50 to-white",
              },
            ].map(({ icon, label, value, bg }, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-br ${bg} p-5 shadow-md transition hover:shadow-lg`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-inner">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-snug text-slate-600 sm:text-base">{label}</p>
                  <p className="mt-1 text-2xl font-black tabular-nums text-slate-900 sm:text-3xl">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* List */}
          <section aria-labelledby="history-heading">
            <div className="mb-4 flex items-center gap-2">
              <FaStar className="text-amber-400" aria-hidden />
              <h2 id="history-heading" className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                Your quiz history
              </h2>
            </div>

            {isError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800 shadow">
                <p className="font-bold">We couldn’t load your history.</p>
                <p className="mt-2 text-sm">Please refresh the page or try again later.</p>
              </div>
            )}

            {!isError && pageLoading && (
              <div
                className="flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-2xl border border-sky-100 bg-white p-8 shadow-md"
                role="status"
                aria-live="polite"
              >
                <div
                  className="h-14 w-14 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin"
                  aria-hidden
                />
                <p className="text-center text-lg font-bold text-slate-800">
                  Loading your quizzes…
                </p>
              </div>
            )}

            {!isError && !pageLoading && tableData.length === 0 && (
              <div className="rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
                <p className="text-2xl font-extrabold text-sky-900">No quizzes here yet</p>
                <p className="mx-auto mt-2 max-w-md text-base font-medium text-slate-600">
                  Try different filters, or start a lesson and come back to see your stars and scores!
                </p>
                <Link
                  href="/"
                  className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-sky-600 px-6 text-base font-bold text-white shadow-lg transition hover:bg-sky-700"
                >
                  Explore lessons
                </Link>
              </div>
            )}

            {!isError && !pageLoading && tableData.length > 0 && (
              <QuizCardList rows={tableData} />
            )}
          </section>
        </div>
      </div>
    </>
  );
}

Analysis.Layout = Layout;

function QuizCardList({ rows }) {
  const [expanded, setExpanded] = useState([]);

  const toggle = (i) => {
    setExpanded((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  return (
    <ul className="space-y-4">
      {rows.map((row, i) => {
        const enc = encouragementForScore(row.ratio, row.perfect);
        const open = expanded.includes(i);
        return (
          <li key={row._id || i}>
            <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md ring-1 ring-slate-100/80 transition hover:shadow-lg">
              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-lg bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800"
                        aria-hidden
                      >
                        #{i + 1}
                      </span>
                      <span className="text-2xl" aria-hidden>
                        {enc.emoji}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          enc.tone === "emerald"
                            ? "bg-emerald-100 text-emerald-800"
                            : enc.tone === "sky"
                              ? "bg-sky-100 text-sky-800"
                              : enc.tone === "teal"
                                ? "bg-teal-100 text-teal-800"
                                : enc.tone === "amber"
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-violet-100 text-violet-800"
                        }`}
                      >
                        {enc.text}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-extrabold leading-snug text-slate-900 sm:text-xl">
                      {row.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">{row.dateTime}</p>

                    <div className="mt-4">
                      <div className="flex items-baseline justify-between gap-2 text-sm font-bold text-slate-600">
                        <span>
                          Your score:{" "}
                          <span className="tabular-nums text-slate-900">
                            {row.obtainMark} / {row.totalMark}
                          </span>
                        </span>
                        <span className="tabular-nums text-sky-700">{row.percent}%</span>
                      </div>
                      <div
                        className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200"
                        role="presentation"
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            row.perfect
                              ? "bg-gradient-to-r from-amber-400 to-yellow-400"
                              : "bg-gradient-to-r from-sky-400 to-teal-400"
                          }`}
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="inline-flex min-h-[48px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-base font-bold text-slate-800 transition hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:w-auto sm:min-w-[160px]"
                    aria-expanded={open}
                  >
                    {open ? (
                      <>
                        Hide details
                        <BiChevronUp className="text-2xl" aria-hidden />
                      </>
                    ) : (
                      <>
                        See answers
                        <BiChevronDown className="text-2xl" aria-hidden />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {open && (
                <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50/80 to-white p-3 sm:p-4">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
                    <LessonEnd data={row.data} />
                  </div>
                </div>
              )}
            </article>
          </li>
        );
      })}
    </ul>
  );
}

function LessonEnd({ data }) {
  if (!data) return null;
  return (
    <div className="max-w-none">
      <ValidateQuiz data={data} />
    </div>
  );
}
