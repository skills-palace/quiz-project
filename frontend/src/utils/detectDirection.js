export function detectDirection(text) {
  const rtlChars = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return rtlChars.test(String(text || "")) ? "rtl" : "ltr";
}

/**
 * When the activity title is English but the words/chunks are Arabic, `detectDirection(title)` is wrong.
 * Combines title + all word titles for layout (RTL + font-naskh in quiz UI).
 */
export function layoutDirectionForSequencedQuiz(quiz) {
  const t = quiz && quiz.title != null ? String(quiz.title) : "";
  const words = (Array.isArray(quiz?.quizes) ? quiz.quizes : [])
    .map((w) => (w && w.title != null ? String(w.title) : ""))
    .filter((s) => s.trim() !== "");
  const combined = [t, ...words].join(" ").trim();
  return detectDirection(combined || t);
}

function stripHtmlTags(html) {
  return String(html || "").replace(/<[^>]+>/g, " ");
}

/**
 * Lesson page: combine title + description + quiz titles so English intro + Arabic questions still get RTL + Scheherazade (font-naskh).
 */
export function layoutDirectionForLesson(lesson) {
  if (!lesson) return "ltr";
  const title = lesson.title != null ? String(lesson.title) : "";
  const desc = stripHtmlTags(lesson.description);
  const quizTitles = (Array.isArray(lesson.quizes) ? lesson.quizes : [])
    .map((q) => (q && q.title != null ? String(q.title) : ""))
    .join(" ");
  const combined = [title, desc, quizTitles].join(" ").trim();
  return detectDirection(combined || title);
}
