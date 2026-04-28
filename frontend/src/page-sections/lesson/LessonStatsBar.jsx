import { isValidElement } from "react";

function safeStatValue(v) {
  if (v == null) return "—";
  if (isValidElement(v)) return v;
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    return String(v);
  }
  // Avoid React "Objects are not valid as a React child" for odd API payloads
  return "—";
}

/**
 * Compact lesson meta for learners: large tap-friendly readout, soft cards.
 */
export default function LessonStatsBar({ direction, questionCount, timeContent, totalMark }) {
  const isRtl = direction === "rtl";

  const StatCard = ({ emoji, label, value, tone }) => (
    <div
      className={`flex items-stretch rounded-2xl overflow-hidden shadow-md ring-2 ring-white/70 ${tone}`}
      role="group"
      aria-label={label}
    >
      <div
        className={`px-3 sm:px-4 py-3 flex items-center gap-1.5 text-white font-bold text-sm sm:text-base min-h-[52px]`}
      >
        <span className="text-lg sm:text-xl" aria-hidden>
          {emoji}
        </span>
        <span className="font-naskh sm:whitespace-nowrap">{label}</span>
      </div>
      <div className="bg-white px-3 sm:px-4 py-3 flex items-center justify-center min-w-[3.5rem]">
        <span className="text-xl sm:text-2xl font-extrabold text-slate-800 tabular-nums leading-none">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap items-stretch gap-3 mb-2" dir={direction}>
      <StatCard
        emoji="📝"
        label={isRtl ? "أسئلة" : "Questions"}
        value={String(Number(questionCount) || 0).padStart(2, "0")}
        tone="bg-rose-500"
      />
      <div
        className="flex items-stretch rounded-2xl overflow-hidden shadow-md ring-2 ring-white/70 bg-emerald-500"
        role="group"
        aria-label={isRtl ? "الوقت" : "Time"}
      >
        <div className="px-3 sm:px-4 py-3 flex items-center gap-1.5 text-white font-bold text-sm sm:text-base min-h-[52px]">
          <span className="text-lg sm:text-xl" aria-hidden>
            ⏱️
          </span>
          <span className="font-naskh sm:whitespace-nowrap">{isRtl ? "الوقت" : "Time"}</span>
        </div>
        <div className="bg-white px-3 sm:px-4 py-3 flex items-center justify-center min-w-[4.5rem] text-slate-800 text-lg sm:text-xl font-extrabold tabular-nums">
          {safeStatValue(timeContent)}
        </div>
      </div>
      <StatCard
        emoji="⭐"
        label={isRtl ? "الدرجة" : "Score"}
        value={safeStatValue(totalMark)}
        tone="bg-sky-600"
      />
    </div>
  );
}
