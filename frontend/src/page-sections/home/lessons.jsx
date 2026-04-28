import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { FaLayerGroup } from "react-icons/fa";
import LessonCard from "@/components/card/lesson/lesson-card1";
import { useGetLessonsQuery } from "@/redux/api/lesson-api";
import ReactPaginate from "react-paginate";

function LessonCardSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-2xl border-2 border-sky-100/80 bg-gradient-to-b from-white via-sky-50/30 to-indigo-50/60 shadow-md"
      aria-hidden
    >
      <div className="h-52 bg-slate-200/90 sm:h-60" />
      <div className="space-y-3 bg-gradient-to-r from-sky-200/50 via-blue-100/50 to-indigo-100/50 px-3 py-4">
        <div className="mx-auto h-5 w-4/5 rounded-md bg-slate-200/90" />
        <div className="mx-auto h-4 w-3/5 rounded-md bg-slate-200/80" />
      </div>
      <div className="border-t border-sky-200/40 bg-slate-50/90 p-2.5 sm:p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-slate-100/80 bg-white/90 px-2 py-2.5">
              <div className="mx-auto h-9 w-9 rounded-full bg-slate-200/90" />
              <div className="mx-auto mt-2 h-2.5 w-10 rounded bg-slate-200/80" />
              <div className="mx-auto mt-2 h-3 w-14 rounded bg-slate-200/70" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-10 bg-sky-100/60" />
    </div>
  );
}

function LessonsEmptyState() {
  return (
    <div
      className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-sky-300/90 bg-gradient-to-b from-sky-50/95 to-indigo-50/40 px-5 py-14 text-center shadow-inner"
      role="status"
    >
      <p className="text-lg font-semibold text-sky-950 sm:text-xl">No lessons found</p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-sky-900/75 sm:text-base">
        Try another <strong className="font-semibold text-sky-900">language</strong> or{" "}
        <strong className="font-semibold text-sky-900">grade / class</strong>.
      </p>
    </div>
  );
}

function LessonsSummaryFooter({ displayedCount }) {
  return (
    <div
      className="mt-10 flex flex-col items-center gap-1 rounded-2xl border border-sky-200/80 bg-gradient-to-r from-sky-100/90 via-white to-indigo-100/80 px-4 py-4 text-center shadow-md shadow-sky-100/50 sm:flex-row sm:justify-center sm:gap-3"
      role="status"
    >
      <span className="inline-flex items-center gap-2 text-sky-900/90">
        <FaLayerGroup className="h-4 w-4 shrink-0 text-sky-600" aria-hidden />
        <span className="text-sm font-medium sm:text-base">
          Showing{" "}
          <span className="font-bold tabular-nums text-sky-950">{displayedCount}</span>{" "}
          {displayedCount === 1 ? "lesson" : "lessons"}
        </span>
      </span>
    </div>
  );
}

function Lessons() {
  const router = useRouter();
  const titleSearch = useMemo(() => {
    if (!router.isReady) return undefined;
    const raw = router.query.title;
    const s = Array.isArray(raw) ? raw[0] : raw;
    const t = typeof s === "string" ? s.trim() : "";
    return t || undefined;
  }, [router.isReady, router.query.title]);
  const [grade, setGrade] = useState("K");
  const [dateRange, setDateRange] = useState("last 5 years");
  const [subject, setSubject] = useState("English");
  const [filter, setFilter] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [groupedLessons, setGroupedLessons] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // API expects 1-based indexing
  const lessonsPerPage = 10000;
  /** First client paint must match SSR; RTK `isFetching` / router often differ from server HTML. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch lessons from API (optional ?title= for lesson name search from header)
  const { data = { result: [], total: 0 }, isFetching } = useGetLessonsQuery(
    {
      page: currentPage,
      limit: lessonsPerPage,
      ...(titleSearch ? { title: titleSearch } : {}),
    },
    { skip: !router.isReady }
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [titleSearch]);

  useEffect(() => {
    if (!titleSearch || typeof window === "undefined") return;
    document.getElementById("lessons")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [titleSearch]);

  // Runs automatically when grade (K, 1…6), subject, date, data, or title search changes
  const applyFilters = useCallback(() => {
    const raw = data?.result;
    let filteredData = Array.isArray(raw) ? raw : [];

    // Name search (?title=) matches across the API; do not narrow by grade so results include every grade
    const gradeForFilter = titleSearch ? "All-Grades" : grade;

    // Filter by subject
    if (subject !== "All subjects") {
      filteredData = filteredData.filter(
        (lesson) => lesson.subject.toLowerCase() === subject.toLowerCase()
      );
    }

    // Filter by grade
    if (gradeForFilter !== "All-Grades") {
      filteredData = filteredData.filter((lesson) => lesson.grade.toLowerCase() === gradeForFilter.toLowerCase());
    }

    // Filter by date range
    const currentDate = new Date();
    if (dateRange === "last 7 days") {
      const pastWeek = new Date(currentDate.setDate(currentDate.getDate() - 7));
      filteredData = filteredData.filter(
        (lesson) => new Date(lesson.createdAt) >= pastWeek
      );
    } else if (dateRange === "last 30 days") {
      const pastMonth = new Date(
        currentDate.setDate(currentDate.getDate() - 30)
      );
      filteredData = filteredData.filter(
        (lesson) => new Date(lesson.createdAt) >= pastMonth
      );
    } else if (dateRange === "last 5 years") {
      const pastFiveYears = new Date();
      pastFiveYears.setFullYear(pastFiveYears.getFullYear() - 5);
      filteredData = filteredData.filter(
        (lesson) => new Date(lesson.createdAt) >= pastFiveYears
      );
    }

    // Group by skill and sort by skill order
    const grouped = filteredData.reduce((acc, lesson) => {
      const skill = lesson.skill ? lesson.skill.skill : "Unknown";
      if (!acc[skill]) {
        acc[skill] = [];
      }
      acc[skill].push(lesson);
      return acc;
    }, {});

    const knownSkills = Object.keys(grouped).filter(
      (skill) => skill !== "Unknown"
    );
    const unknownSkills = grouped["Unknown"] || [];

    // Sort known skills by the order field
    const sortedGroupedLessons = knownSkills
      .sort((a, b) => {
        const skillAOrder = grouped[a][0].skill?.order ?? 0;
        const skillBOrder = grouped[b][0].skill?.order ?? 0;
        return skillAOrder - skillBOrder;
      })
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {});

    if (unknownSkills.length > 0) {
      sortedGroupedLessons["Unknown"] = unknownSkills;
    }

    setGroupedLessons(sortedGroupedLessons);
    setFiltered(filteredData);
    setFilter(true);
    setCurrentPage(1); // Reset to first page after applying filters
  }, [data, grade, subject, dateRange, titleSearch]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected + 1);
  };

  useEffect(() => {
    if (!router.isReady) return;
    applyFilters();
  }, [router.isReady, applyFilters]);

  const displayedLessonCount = useMemo(() => {
    if (!data?.result) return 0;
    if (Object.keys(groupedLessons).length > 0) {
      return Object.values(groupedLessons).reduce((sum, list) => sum + list.length, 0);
    }
    if (filter) return filtered.length;
    return data.result.length;
  }, [data?.result, groupedLessons, filter, filtered]);

  const displayLessons = () => {
    if (Object.keys(groupedLessons).length > 0) {
      return (
        <div className="mt-8 space-y-10">
          {Object.keys(groupedLessons).map((skill) => (
            <div
              key={skill}
              className="overflow-hidden rounded-2xl border border-sky-200/70 bg-white/60 shadow-lg shadow-sky-100/30 ring-1 ring-sky-100/60"
            >
              <h3 className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 px-3 py-3.5 text-center font-naskh text-base font-bold text-white shadow-sm sm:text-lg">
                {skill}
              </h3>
              <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 md:grid-cols-3 lg:grid-cols-4">
                {groupedLessons[skill].map((lesson) => (
                  <LessonCard key={lesson._id} lesson={lesson} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (filter) {
      return (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      );
    } else {
      return (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.result?.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      );
    }
  };

  const totalLessons = data.total;

  return (
    <div id="lessons" className="container mx-auto mt-4 min-h-[70vh] rounded-lg bg-sky-50 p-2 pb-10">
      <h2 className="font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 mb-1  sm:text-2xl md:text-3xl lg:text-4xl font-sans">
        Your Self-Learning Gateway
      </h2>

      {mounted && router.isReady && titleSearch ? (
        <p className="text-center text-sm text-gray-600 mb-4">
          Showing lessons matching{" "}
          <span className="font-semibold text-gray-800">{titleSearch}</span>{" "}
          across all grades.
        </p>
      ) : null}

      <p className="text-gray-600 text-justify mb-8 max-w-4xl mx-auto text-sm sm:text-base md:text-lg lg:text-lg font-sans">
        A comprehensive library of scientific, literary, historical, and
        cultural lessons designed for all levels. Test your understanding with
        interactive questions for each lesson and receive instant feedback.
        Track your progress effortlessly and learn anytime, anywhere.
      </p>

      {/* Filter Section */}
      <div className="bg-sky-300 shadow-md rounded-lg p-2 mb-4 max-w-fit mx-auto flex items-center space-x-2 text-md font-medium">
        <div className="flex space-x-2 bg-sky-200 p-2 rounded-lg flex flex-wrap gap-y-1 w-full justify-center  ">
          <p className="font-sans text-center text-md">Lang</p>
          {/*  
          <button
            onClick={() => setSubject("All subjects")}
            className={`py-1 px-3 text-xs font-medium rounded-full ${
              subject === "All subjects"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-blue-300"
            }`}
          >
            All
          </button>
          */}

          <button
            onClick={() => setSubject("English")}
            className={`py-1 px-3 text-xs font-medium rounded-full ${
              subject === "English"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 hover:bg-blue-300"
            }`}
          >
            English
          </button>
          {/*
          <button
            onClick={() => setSubject("French")}
            className={`py-1 px-3 text-xs font-medium rounded-full ${
              subject === "French"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 hover:bg-blue-300"
            }`}
          >
            French
          </button>
          <button
            onClick={() => setSubject("Spanish")}
            className={`py-1 px-3 text-xs font-medium rounded-full ${
              subject === "Spanish"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 hover:bg-blue-300"
            }`}
          >
            Spanish
          </button>
          */}
          <button
            onClick={() => setSubject("Arabic")}
            className={`py-1 px-3 text-xs font-medium rounded-full ${
              subject === "Arabic"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 hover:bg-blue-300"
            }`}
          >
            Arabic
          </button>
        </div>
      </div>
      <div className="flex space-x-2 bg-sky-50 p-2 rounded-lg flex flex-wrap gap-y-1 w-full justify-center ">
        {/*
          <button
            onClick={() => setGrade('All-Grades')}
            className={`py-1 px-3 text-md font-medium rounded-full ${
              grade === 'All-Grades' 
              ? 'bg-red-500 text-white border border-red-500' 
              : 'bg-gray-200 hover:bg-blue-300'}`}
          >
            All
          </button>
        */}
        <button
          onClick={() => setGrade("K")}
          className={`px-3 py-1 text-md font-medium rounded-full ${
            grade === "K"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-green-300 hover:bg-blue-300"
          }`}
        >
          K
        </button>
        <button
          onClick={() => setGrade("1st")}
          className={`px-4 py-1 text-md font-medium rounded-full ${
            grade === "1st"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-indigo-300 hover:bg-blue-300"
          }`}
        >
          1
        </button>
        <button
          onClick={() => setGrade("2nd")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "2nd"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-rose-300 hover:bg-blue-300"
          }`}
        >
          2
        </button>
        <button
          onClick={() => setGrade("3rd")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "3rd"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-pink-300 hover:bg-blue-300"
          }`}
        >
          3
        </button>
        <button
          onClick={() => setGrade("4th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "4th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-fuchsia-300 hover:bg-blue-300"
          }`}
        >
          4
        </button>
        <button
          onClick={() => setGrade("5th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "5th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-purple-300 hover:bg-blue-300"
          }`}
        >
          5
        </button>
        <button
          onClick={() => setGrade("6th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "6th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-violet-300 hover:bg-blue-300"
          }`}
        >
          6
        </button>
        {/*
        <button
          onClick={() => setGrade("7th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "7th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-indigo-300 hover:bg-blue-300"
          }`}
        >
          7
        </button>
        <button
          onClick={() => setGrade("8th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "8th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-teal-300 hover:bg-blue-300"
          }`}
        >
          8
        </button>
        <button
          onClick={() => setGrade("9th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "9th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-orange-300 hover:bg-blue-300"
          }`}
        >
          9
        </button>
        <button
          onClick={() => setGrade("10th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "10th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-yellow-300 hover:bg-blue-300"
          }`}
        >
          10
        </button>
        <button
          onClick={() => setGrade("11th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "11th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-emerald-300 hover:bg-blue-300"
          }`}
        >
          11
        </button>
        <button
          onClick={() => setGrade("12th")}
          className={` px-3 py-1 text-md font-medium rounded-full ${
            grade === "12th"
              ? "bg-red-500 text-white border border-red-500"
              : "bg-lime-400 hover:bg-blue-300"
          }`}
        >
          12
        </button>
        */}
        <div className="flex space-x-3 ml-4">
          {/*
          <button
            onClick={() => setDateRange('last 7 days')}
            className={`py-1 px-3 text-xs font-medium rounded-md ${dateRange === 'last 7 days' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-300'}`}
          >
            Last 7 days
          </button>
         
          <button
            onClick={() => setDateRange('last 30 days')}
            className={`py-1 px-3 text-xs font-medium rounded-md ${dateRange === 'last 30 days' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-300'}`}
          >
            Last 30 days
          </button>
          
          <button
            onClick={() => setDateRange('last 5 years')}
            className={`py-1 px-3 text-xs font-medium rounded-md ${dateRange === 'last 5 years' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-blue-300'}`}
          >
            Last 5 years
          </button>
          */}
        </div>

      </div>

      {!mounted || isFetching ? (
        <div className="min-h-[50vh]">
          <p className="mb-4 text-center text-sm font-medium text-sky-800/80">
            Loading lessons…
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <LessonCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {displayedLessonCount === 0 ? (
            <LessonsEmptyState />
          ) : (
            <>
              {displayLessons()}
              <LessonsSummaryFooter displayedCount={displayedLessonCount} />
            </>
          )}
          {totalLessons > lessonsPerPage && displayedLessonCount > 0 ? (
            <nav
              className="mt-8 flex justify-center border-t border-sky-200/60 pt-8"
              aria-label="Lesson pages"
            >
              <ReactPaginate
                previousLabel="Previous"
                nextLabel="Next"
                breakLabel="…"
                pageCount={Math.ceil(totalLessons / lessonsPerPage)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageChange}
                containerClassName="flex flex-wrap items-center justify-center gap-2 text-sm text-sky-900/85"
                pageClassName=""
                pageLinkClassName="inline-flex min-w-[2.25rem] items-center justify-center rounded-full border border-sky-200/80 bg-white px-3 py-1.5 font-medium transition-colors hover:border-sky-300 hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                activeClassName="!border-sky-600"
                activeLinkClassName="!bg-gradient-to-r !from-sky-500 !to-indigo-600 !text-white !border-transparent shadow-md"
                previousClassName=""
                previousLinkClassName="inline-flex items-center justify-center rounded-full border border-sky-200/80 bg-white px-3 py-1.5 font-medium transition-colors hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                nextClassName=""
                nextLinkClassName="inline-flex items-center justify-center rounded-full border border-sky-200/80 bg-white px-3 py-1.5 font-medium transition-colors hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                breakClassName=""
                breakLinkClassName="inline-flex min-w-[2.25rem] items-center justify-center px-2 py-1.5 text-sky-600"
                disabledClassName="pointer-events-none opacity-40"
                forcePage={currentPage - 1}
              />
            </nav>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default Lessons;
