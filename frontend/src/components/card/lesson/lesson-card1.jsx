import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaGraduationCap,
  FaLanguage,
  FaStopwatch,
  FaTrophy,
} from "react-icons/fa";
import { Text } from "@/components/StyledComponents";
import { detectDirection } from "@/utils/detectDirection";

function formatSubjectLabel(subject, isRtl) {
  if (!subject) return "—";
  const s = String(subject).toLowerCase();
  if (!isRtl) return subject;
  if (s === "arabic" || s.includes("arabic")) return "العربية";
  if (s === "english") return "الإنجليزية";
  if (s === "french") return "الفرنسية";
  if (s === "spanish") return "الإسبانية";
  return subject;
}

/** هادئة: ألوان باستيل خافتة وظلال خفيفة */
const STAT_THEMES = {
  lang: {
    accentBar: "bg-gradient-to-r from-emerald-100/90 via-teal-100 to-cyan-100/90",
    surface: "bg-gradient-to-b from-stone-50/80 via-white to-emerald-50/35",
    iconBox:
      "rounded-[10px] border border-emerald-100/90 bg-gradient-to-b from-white to-emerald-50/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-emerald-100/40",
    icon: "text-emerald-600/75",
    label: "text-slate-600",
    value: "text-slate-800",
    valueWell:
      "border border-emerald-100/80 bg-stone-50/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]",
    card: "border-emerald-100/70 shadow-sm shadow-stone-200/40 ring-stone-100/80",
  },
  grade: {
    accentBar: "bg-gradient-to-r from-slate-200/70 via-indigo-100 to-slate-200/70",
    surface: "bg-gradient-to-b from-stone-50/80 via-white to-indigo-50/30",
    iconBox:
      "rounded-[10px] border border-indigo-100/90 bg-gradient-to-b from-white to-indigo-50/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-indigo-100/40",
    icon: "text-indigo-500/70",
    label: "text-slate-600",
    value: "text-slate-800",
    valueWell:
      "border border-indigo-100/80 bg-stone-50/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]",
    card: "border-indigo-100/70 shadow-sm shadow-stone-200/40 ring-stone-100/80",
  },
  points: {
    accentBar: "bg-gradient-to-r from-stone-200/80 via-amber-100/95 to-stone-200/80",
    surface: "bg-gradient-to-b from-stone-50/80 via-white to-amber-50/25",
    iconBox:
      "rounded-[10px] border border-amber-100/90 bg-gradient-to-b from-white to-amber-50/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-amber-100/40",
    icon: "text-amber-600/65",
    label: "text-slate-600",
    value: "text-slate-800",
    valueWell:
      "border border-amber-100/80 bg-stone-50/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]",
    card: "border-amber-100/70 shadow-sm shadow-stone-200/40 ring-stone-100/80",
  },
  time: {
    accentBar: "bg-gradient-to-r from-rose-100/90 via-stone-200/60 to-rose-100/90",
    surface: "bg-gradient-to-b from-stone-50/80 via-white to-rose-50/28",
    iconBox:
      "rounded-[10px] border border-rose-100/90 bg-gradient-to-b from-white to-rose-50/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-rose-100/40",
    icon: "text-rose-500/70",
    label: "text-slate-600",
    value: "text-slate-800",
    valueWell:
      "border border-rose-100/80 bg-stone-50/90 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]",
    card: "border-rose-100/70 shadow-sm shadow-stone-200/40 ring-stone-100/80",
  },
};

const Card1 = ({ lesson }) => {
  if (!lesson) return null;

  /** Direct API URL (skillspalace.com/_next/image proxy was returning 404 upstream). */
  const defaultImage =
    "https://server-end-point.skillspalace.com/api/file/image/DALL%C3%82%C2%B7E%202024-10-09%2016.22.09%20-%20A%20breathtaking%20depiction%20of%20the%20vast%20universe%20filled%20with%20stars%2C%20planets%2C%20and%20galaxies.%20At%20the%20center%20is%20the%20Sun%2C%20a%20medium-sized%20star%2C%20with%20Earth%20and%20_11.jpg";

  const quizTitleDirection = detectDirection(lesson.title);
  const isRtl = quizTitleDirection === "rtl";

  const copy = isRtl
    ? {
        language: "اللغة",
        grade: "الصف",
        points: "الدرجة",
        time: "الوقت",
        minutes: "دقيقة",
        cta: "ابدأ الدرس",
        openLesson: "فتح الدرس",
      }
    : {
        language: "Language",
        grade: "Grade",
        points: "Score",
        time: "Time",
        minutes: "min",
        cta: "Start lesson",
        openLesson: "Open lesson",
      };

  const subjectDisplay = formatSubjectLabel(lesson.subject, isRtl);
  const hasTime = lesson.time != null && lesson.time !== "";

  const TimeValue = () =>
    hasTime ? (
      <span className="inline-flex flex-wrap items-baseline justify-center gap-x-0.5 gap-y-0" dir={isRtl ? "rtl" : "ltr"}>
        <span className="text-[10px] font-black tabular-nums leading-none sm:text-[11px]">{lesson.time}</span>
        <span className={`text-[8px] font-bold opacity-85 sm:text-[9px] ${STAT_THEMES.time.label}`}>{copy.minutes}</span>
      </span>
    ) : (
      "—"
    );

  const StatCell = ({ Icon, label, value, themeKey, ariaLabel }) => {
    const t = STAT_THEMES[themeKey];
    return (
      <div
        className={`relative min-h-[4.1rem] min-w-0 overflow-hidden rounded-xl border text-center ring-1 sm:min-h-[4.35rem] ${t.surface} ${t.card} ${isRtl ? "font-naskh" : "font-sans"}`}
        title={ariaLabel}
      >
        <div className={`h-0.5 w-full shrink-0 ${t.accentBar}`} aria-hidden />
        <div className="grid min-h-0 grid-rows-[auto_minmax(1.2rem,auto)_auto] gap-0.5 px-1.5 pb-1.5 pt-1 sm:gap-1 sm:px-2 sm:pb-2 sm:pt-1.5">
          <div className="flex justify-center">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center sm:h-7 sm:w-7 ${t.iconBox}`}
              aria-hidden
            >
              <Icon className={`h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 ${t.icon}`} />
            </div>
          </div>
          <p
            className={`flex w-full items-center justify-center px-0.5 text-[8px] font-bold uppercase leading-tight tracking-wide sm:text-[9px] ${t.label} ${isRtl ? "normal-case tracking-normal" : ""}`}
          >
            <span className="line-clamp-2 break-words">{label}</span>
          </p>
          <div
            className={`flex min-h-[1.2rem] w-full min-w-0 items-center justify-center rounded-md px-1 py-0.5 sm:min-h-[1.35rem] sm:px-1.5 sm:py-0.5 ${t.valueWell}`}
          >
            <p
              className={`w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-center text-[10px] font-extrabold leading-tight sm:text-[11px] ${t.value}`}
              dir="auto"
            >
              {value}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const statsAria = isRtl
    ? `${copy.language}: ${subjectDisplay}، ${copy.grade}: ${lesson.grade ?? "—"}، ${copy.points}: ${lesson.total_mark ?? "—"}، ${copy.time}: ${hasTime ? `${lesson.time} ${copy.minutes}` : "—"}`
    : `${copy.language} ${subjectDisplay}, ${copy.grade} ${lesson.grade ?? "—"}, ${copy.points} ${lesson.total_mark ?? "—"}, ${copy.time} ${hasTime ? `${lesson.time} ${copy.minutes}` : "—"}`;

  const imageBase = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const imageSrc = lesson.imagePath
    ? `${imageBase}/${String(lesson.imagePath).replace(/^\//, "")}`
    : defaultImage;

  return (
    <Link
      href={`/lesson/${lesson._id}`}
      className="group block h-full rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
      aria-label={`${copy.openLesson}: ${lesson.title}`}
    >
      <div className="relative h-full overflow-hidden rounded-2xl border-2 border-sky-100 bg-gradient-to-b from-white via-sky-50/40 to-indigo-50/80 shadow-lg transition-[border-color,box-shadow,transform] duration-300 motion-safe:transform motion-safe:hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl motion-reduce:hover:translate-y-0">
        <div className="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400" />

        <div className="relative h-52 w-full overflow-hidden bg-slate-100 sm:h-60">
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        </div>

        <div className="bg-gradient-to-r from-sky-200/90 via-blue-100/90 to-indigo-100/90 px-3 py-4 text-center">
          <Text direction={quizTitleDirection} className="">
            <div
              className={`${
                isRtl
                  ? "font-naskh font-bold text-sky-900 text-base sm:text-lg md:text-xl"
                  : "font-sans font-bold text-sky-900 text-base sm:text-lg"
              } text-center leading-snug`}
            >
              {lesson.title}
            </div>
          </Text>
        </div>

        <div
          className="border-t border-sky-200/50 bg-gradient-to-b from-slate-50/95 to-sky-50/60 p-1.5 sm:p-2"
          dir={quizTitleDirection}
        >
          <p className="sr-only">{statsAria}</p>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 sm:gap-1.5">
            <StatCell
              Icon={FaLanguage}
              label={copy.language}
              value={subjectDisplay}
              themeKey="lang"
              ariaLabel={`${copy.language}: ${subjectDisplay}`}
            />
            <StatCell
              Icon={FaGraduationCap}
              label={copy.grade}
              value={lesson.grade ?? "—"}
              themeKey="grade"
              ariaLabel={`${copy.grade}: ${lesson.grade ?? "—"}`}
            />
            <StatCell
              Icon={FaTrophy}
              label={copy.points}
              value={lesson.total_mark ?? "—"}
              themeKey="points"
              ariaLabel={`${copy.points}: ${lesson.total_mark ?? "—"}`}
            />
            <StatCell
              Icon={FaStopwatch}
              label={copy.time}
              value={<TimeValue />}
              themeKey="time"
              ariaLabel={`${copy.time}: ${hasTime ? `${lesson.time} ${copy.minutes}` : "—"}`}
            />
          </div>
        </div>

        <div
          className={`flex items-center justify-center gap-1 border-t border-sky-200/50 bg-gradient-to-r from-sky-50/90 to-indigo-50/80 py-2 text-[10px] font-bold text-sky-800/90 transition-colors duration-300 group-hover:border-sky-300/60 group-hover:from-sky-100/95 group-hover:to-indigo-50/90 group-hover:text-sky-950 sm:text-[11px] ${isRtl ? "font-naskh" : "font-sans"}`}
          aria-hidden
        >
          <span>{copy.cta}</span>
          {isRtl ? (
            <FaChevronLeft className="h-2.5 w-2.5 opacity-80 sm:h-3 sm:w-3" aria-hidden />
          ) : (
            <FaChevronRight className="h-2.5 w-2.5 opacity-80 sm:h-3 sm:w-3" aria-hidden />
          )}
        </div>
      </div>
    </Link>
  );
};

export default Card1;
