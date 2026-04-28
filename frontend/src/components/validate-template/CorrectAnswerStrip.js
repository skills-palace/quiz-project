import { detectDirection } from "@/utils/detectDirection";

/**
 * Shows a highlighted “correct answer” line when `review` has text from the server.
 */
export default function CorrectAnswerStrip({ titleText, review, className = "" }) {
  if (!review) return null;
  const list =
    Array.isArray(review.correctTexts) && review.correctTexts.length > 0
      ? review.correctTexts
      : null;
  const text =
    review.correctText ?? review.correctOptionsText ?? null;
  if (
    (list == null && (text == null || String(text).trim() === ""))
  ) {
    return null;
  }
  const contentSample =
    list && list.length > 0 ? list.join(" ") : String(text || "");
  const dir = detectDirection(
    [titleText || "", contentSample].filter(Boolean).join(" ")
  );
  const isRtl = dir === "rtl";

  return (
    <div
      className={`mt-3 rounded-lg border border-emerald-200/90 bg-emerald-50 px-3 py-2.5 text-sm leading-relaxed text-emerald-950 shadow-sm ring-1 ring-emerald-100/80 sm:text-base ${
        isRtl ? "font-naskh" : "font-sans"
      } ${className}`}
      dir={dir}
    >
      <span
        className={`font-bold text-emerald-900 ${isRtl ? "font-naskh" : "font-sans"}`}
      >
        {isRtl
          ? (list && list.length > 1
              ? "صيَغ صحيحة (أيٌ منها) "
              : "الإجابة الصحيحة: ")
          : (list && list.length > 1
              ? "Accepted answers (any of): "
              : "Correct answer: ")}
      </span>
      {list && list.length > 0 ? (
        <ol
          className={`mt-1 list-decimal font-semibold [text-align:start] ${
            isRtl ? "pr-5 font-naskh" : "pl-5 font-sans"
          }`}
        >
          {list.map((t, i) => (
            <li key={i} className="py-0.5">
              {t}
            </li>
          ))}
        </ol>
      ) : (
        <span
          className={`font-semibold ${isRtl ? "font-naskh" : "font-sans"}`}
        >
          {text}
        </span>
      )}
    </div>
  );
}
