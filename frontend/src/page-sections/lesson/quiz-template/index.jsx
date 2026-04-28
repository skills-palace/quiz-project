import { useState, useRef, useCallback, useEffect, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { answers, setStage } from "@/redux/slices/lesson-slice";
import { detectDirection } from "@/utils/detectDirection";
import QuizIntro from "./intro";
import QuestionSpeechBar from "./QuestionSpeechBar";

const MultiChoice2 = lazy(() => import("@/components/quiz-template/multiple-choice2"));
const MultiChoice = lazy(() => import("@/components/quiz-template/multiple-choice"));
const Rearrange = lazy(() => import("@/components/quiz-template/rearrange"));
const GroupSort = lazy(() => import("@/components/quiz-template/group-sort"));
const MathQuiz = lazy(() => import("@/components/quiz-template/math"));
const MissingWord = lazy(() => import("@/components/quiz-template/missing-word"));
const BlankSpace = lazy(() => import("@/components/quiz-template/blank-sapce"));
const Highlight = lazy(() => import("@/components/quiz-template/highlight-word"));
const LineConnect = lazy(() => import("@/components/quiz-template/line-connect"));
const TrueFalse = lazy(() => import("@/components/quiz-template/true-false"));
const Classification = lazy(() => import("@/components/quiz-template/classification"));
const Reorder = lazy(() => import("@/components/quiz-template/reorder"));
const ConsonantBlend = lazy(() => import("@/components/quiz-template/consonant-blend"));
const WordBank = lazy(() => import("@/components/quiz-template/word-bank"));

function QuizBodyFallback({ direction }) {
  return (
    <div
      className={`flex min-h-[12rem] items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/50 ${
        direction === "rtl" ? "font-naskh" : "font-sans"
      }`}
      aria-live="polite"
      role="status"
    >
      <p className="text-base font-semibold text-slate-500 sm:text-lg">
        {direction === "rtl" ? "جاري التحميل…" : "Loading…"}
      </p>
    </div>
  );
}

function renderQuizByType(type, quiz, nextQ) {
  const props = { quiz, nextQ };
  switch (type) {
    case "multiple_choice2":
      return <MultiChoice2 {...props} />;
    case "multiple_choice":
      return <MultiChoice {...props} />;
    case "rearrange":
      return <Rearrange {...props} />;
    case "group_sort":
      return <GroupSort {...props} />;
    case "math":
      return <MathQuiz {...props} />;
    case "missing_word":
      return <MissingWord {...props} />;
    case "line_connect":
      return <LineConnect {...props} />;
    case "true_false":
      return <TrueFalse {...props} />;
    case "classification":
      return <Classification {...props} />;
    case "reorder":
      return <Reorder {...props} />;
    case "blank_space":
      return <BlankSpace {...props} />;
    case "highlight_word":
      return <Highlight {...props} />;
    case "consonant_blend":
      return <ConsonantBlend {...props} />;
    case "word_bank":
      return <WordBank {...props} />;
    default:
      return (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 text-center text-amber-900">
          Unknown question type: {String(type)}
        </div>
      );
  }
}

function QuizTemplate({ quizes, id, hideParagraphSide = 0 }) {
  const [qCount, setQcount] = useState(0);
  const [showParagraphOverride, setShowParagraphOverride] = useState(false);
  const dispatch = useDispatch();
  const lessonHidesParagraph = Number(hideParagraphSide) === 1;
  const shouldHideParagraphSide = lessonHidesParagraph && !showParagraphOverride;
  const nativeAudioRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const quizList = (Array.isArray(quizes) ? quizes : []).filter((q) => q != null);

  useEffect(() => {
    if (quizList.length > 0 && qCount >= quizList.length) {
      setQcount(0);
    }
  }, [quizList.length, qCount]);

  const onNativeAudioPlay = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const currentQuiz = quizList[qCount];
  const textForPageDirection = [
    currentQuiz?.title,
    (currentQuiz?.description || "").replace(/<[^>]*>/g, " "),
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
  const pageDirection = detectDirection(
    textForPageDirection || currentQuiz?.description || ""
  );
  const progressPct = quizList.length ? ((qCount + 1) / quizList.length) * 100 : 0;

  const nextQ = useCallback(
    (answer) => {
      dispatch(answers(answer));
      if (quizList.length > qCount + 1) {
        setQcount((c) => c + 1);
      } else {
        dispatch(setStage("end"));
      }
    },
    [dispatch, quizList.length, qCount]
  );

  if (!currentQuiz) {
    return <div className="text-center text-xl font-semibold text-red-500">Quiz not found</div>;
  }

  const motionTransition = { duration: shouldReduceMotion ? 0.12 : 0.28, ease: "easeOut" };
  const motionVariants = shouldReduceMotion
    ? {
        enter: { opacity: 0 },
        in: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: { x: 40, opacity: 0 },
        in: { x: 0, opacity: 1 },
        exit: { x: -40, opacity: 0 },
      };

  return (
    <div
      className="relative inset-0 mx-auto w-full max-w-6xl h-full bg-gradient-to-br from-sky-50 to-indigo-50/80 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl min-w-0"
      dir={pageDirection}
    >
      <div className="mb-3 rounded-2xl bg-white/90 p-3 shadow-inner ring-1 ring-sky-100 w-full">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-2">
          <p
            className={`text-lg sm:text-xl font-extrabold text-slate-800 min-w-0 flex-1 ${
              pageDirection === "rtl" ? "font-naskh" : "font-sans"
            }`}
          >
            {pageDirection === "rtl"
              ? `السؤال ${qCount + 1} من ${quizList.length}`
              : `Question ${qCount + 1} of ${quizList.length}`}
          </p>
          <div
            className="flex items-stretch flex-shrink-0 min-h-[2.5rem] rounded-2xl bg-gradient-to-b from-sky-50/95 to-sky-100/50 ring-1 ring-sky-200/70 shadow-sm p-0.5 gap-0.5"
            role="group"
            aria-label={
              pageDirection === "rtl" ? "التقدم وعرض النص" : "Progress and text panel"
            }
          >
            <span
              className={`inline-flex items-center text-sm font-bold tabular-nums text-sky-800 bg-white/80 px-2.5 sm:px-3 rounded-[0.9rem] ${
                pageDirection === "rtl" ? "font-naskh" : "font-sans"
              }`}
            >
              {Math.round(progressPct)}%
            </span>
            {lessonHidesParagraph && (
              <>
                <span
                  className="w-px self-stretch my-1 bg-sky-200/90 shrink-0"
                  aria-hidden
                />
                <button
                  type="button"
                  onClick={() => setShowParagraphOverride((v) => !v)}
                  aria-pressed={showParagraphOverride}
                  title={
                    pageDirection === "rtl"
                      ? showParagraphOverride
                        ? "إخفاء نص السؤال (الفقرة والصوت)"
                        : "إظهار نص السؤال (الفقرة والصوت)"
                      : showParagraphOverride
                        ? "Hide question paragraph and audio"
                        : "Show question paragraph and audio"
                  }
                  aria-label={
                    pageDirection === "rtl"
                      ? showParagraphOverride
                        ? "إخفاء نص السؤال"
                        : "إظهار نص السؤال"
                      : showParagraphOverride
                        ? "Hide question text"
                        : "Show question text"
                  }
                  className={`inline-flex items-center justify-center gap-1.5 rounded-[0.9rem] px-2 sm:px-2.5 min-w-[2.5rem] text-xs sm:text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-sky-500 ${
                    pageDirection === "rtl" ? "font-naskh" : "font-sans"
                  } ${
                    showParagraphOverride
                      ? "bg-slate-200/90 text-slate-800 hover:bg-slate-300/90"
                      : "bg-sky-600 text-white hover:bg-sky-700 shadow-sm"
                  }`}
                >
                  {showParagraphOverride ? (
                    <AiOutlineEyeInvisible className="shrink-0 text-base sm:text-lg opacity-90" aria-hidden />
                  ) : (
                    <AiOutlineEye className="shrink-0 text-base sm:text-lg opacity-90" aria-hidden />
                  )}
                  <span className="whitespace-nowrap max-sm:sr-only">
                    {pageDirection === "rtl"
                      ? showParagraphOverride
                        ? "إخفاء النص"
                        : "إظهار النص"
                      : showParagraphOverride
                        ? "Hide text"
                        : "Show text"}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
        <div
          className="h-4 w-full rounded-full bg-sky-100 overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progressPct)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={qCount}
          initial="enter"
          animate="in"
          exit="exit"
          transition={motionTransition}
          variants={motionVariants}
          className={`grid grid-cols-1 gap-4 sm:gap-5 h-fit w-full shadow-lg rounded-2xl overflow-hidden [touch-action:manipulation] ${
            shouldHideParagraphSide ? "" : "xl:grid-cols-2"
          }`}
        >
          {!shouldHideParagraphSide && (
            <div className="order-1 overflow-y-auto quiz-scroll-panel w-full min-w-0 bg-white border-2 border-sky-100 rounded-2xl p-3 sm:p-4 shadow-sm">
              <QuestionSpeechBar
                html={currentQuiz.description}
                direction={pageDirection}
                questionKey={`${id}-${qCount}`}
                nativeAudioRef={nativeAudioRef}
              />
              {currentQuiz?.audioPath && (
                <audio
                  ref={nativeAudioRef}
                  className="border-2 border-sky-200 rounded-2xl w-full max-w-lg min-h-[52px] mb-3 bg-sky-50/50"
                  controlsList="nodownload"
                  controls
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}/${currentQuiz?.audioPath}`}
                  onPlay={onNativeAudioPlay}
                />
              )}
              <QuizIntro data={currentQuiz.description} />
            </div>
          )}

          <div
            className={`overflow-y-auto quiz-scroll-panel w-full min-w-0 bg-white border-2 border-sky-100 rounded-2xl p-3 sm:p-4 shadow-sm ${
              shouldHideParagraphSide ? "" : "order-2"
            }`}
          >
            <Suspense fallback={<QuizBodyFallback direction={pageDirection} />}>
              {renderQuizByType(currentQuiz.type, currentQuiz, nextQ)}
            </Suspense>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default QuizTemplate;
