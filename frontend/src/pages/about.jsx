import React from "react";
import Link from "next/link";
import Layout from "@/layout/site";

const iconClass = "w-6 h-6 text-blue-600";

const Icons = {
  platform: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  home: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  quiz: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  chart: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  student: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  teacher: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  storage: (
    <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
};

const features = [
  {
    key: "platform",
    title: "Skills Palace",
    description:
      "A comprehensive online platform covering science, culture, language, and history for learners from pre-kindergarten through twelfth grade.",
    icon: Icons.platform,
  },
  {
    key: "home",
    title: "Homepage",
    description:
      "Latest lessons across core subjects with simple filters so students and families can find the right content quickly.",
    icon: Icons.home,
  },
  {
    key: "quiz",
    title: "Quizzes",
    description:
      "Interactive quizzes with randomized items and shuffled options, plus a wide range of question types.",
    icon: Icons.quiz,
  },
  {
    key: "chart",
    title: "Results & analysis",
    description:
      "See scores, correct and incorrect items, and time-based stats to understand how learning is going.",
    icon: Icons.chart,
  },
  {
    key: "student",
    title: "Student accounts",
    description:
      "Personalized access to lessons, work, and performance views aligned with grade level.",
    icon: Icons.student,
  },
  {
    key: "teacher",
    title: "Teacher tools",
    description:
      "Create lessons and quizzes, manage groups, and use templates built for the classroom.",
    icon: Icons.teacher,
  },
  {
    key: "storage",
    title: "Progress tracking",
    description:
      "Quiz data is stored for reporting and long-term progress monitoring.",
    icon: Icons.storage,
  },
];

const stats = [
  { label: "Grade span", value: "Pre-K–12" },
  { label: "Focus", value: "Core subjects" },
  { label: "Experience", value: "Interactive" },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <header className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase mb-3">
            About us
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            About Skills Palace
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
            We help students learn with structured lessons, engaging quizzes, and
            clear feedback—whether you are at home, in class, or on the go.
          </p>
        </header>

        <ul
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14"
          role="list"
        >
          {stats.map((s) => (
            <li
              key={s.label}
              className="flex flex-col items-center justify-center rounded-2xl border border-blue-100/80 bg-white/90 py-6 px-4 shadow-sm text-center"
            >
              <span className="text-2xl sm:text-3xl font-bold text-blue-800 tabular-nums">
                {s.value}
              </span>
              <span className="mt-1 text-sm font-medium text-slate-500">
                {s.label}
              </span>
            </li>
          ))}
        </ul>

        <section aria-labelledby="features-heading" className="mb-16">
          <h2
            id="features-heading"
            className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2"
          >
            What you get
          </h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-10">
            Everything in one place—from discovery on the homepage to results you
            can act on.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <article
                key={f.key}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-md shadow-slate-200/50 transition duration-200 hover:shadow-lg hover:border-blue-200/80"
              >
                <div
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100"
                  aria-hidden
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-[15px] sm:text-base">
                  {f.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="rounded-3xl bg-gradient-to-r from-blue-700 to-blue-800 px-6 py-10 sm:px-10 sm:py-12 text-center text-white shadow-xl shadow-blue-900/20"
          aria-labelledby="cta-heading"
        >
          <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold mb-2">
            Ready to start?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto mb-8 text-sm sm:text-base">
            Create a free account, explore plans, or reach out for schools and
            groups.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="inline-flex justify-center font-semibold text-base py-3 px-6 rounded-xl bg-white text-blue-800 shadow-md hover:bg-blue-50 transition active:scale-[0.98]"
            >
              Create free account
            </Link>
            <Link
              href="/membership"
              className="inline-flex justify-center font-semibold text-base py-3 px-6 rounded-xl border-2 border-white/90 text-white hover:bg-white/10 transition active:scale-[0.98]"
            >
              View membership
            </Link>
            <Link
              href="/contact-us"
              className="inline-flex justify-center font-semibold text-base py-3 px-6 rounded-xl text-blue-100 underline-offset-4 hover:underline hover:text-white sm:border-0"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

AboutUs.Layout = Layout;
export default AboutUs;
