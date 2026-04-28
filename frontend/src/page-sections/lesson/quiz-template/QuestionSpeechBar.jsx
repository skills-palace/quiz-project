import { useMemo, useCallback, useState } from "react";
import { BiPause, BiPlay, BiStop, BiVolumeFull } from "react-icons/bi";
import { htmlToPlainText } from "@/utils/htmlToPlainText";
import { useQuestionSpeech } from "@/hooks/useQuestionSpeech";

/**
 * TTS لوصف الدرس / الفقرة (HTML فقط)، وليس لعنوان سؤال الاختبار.
 */
export default function QuestionSpeechBar({ html, direction, questionKey, nativeAudioRef }) {
  const plain = useMemo(() => htmlToPlainText(html || ""), [html]);
  const [rate, setRate] = useState(0.85);

  const pauseNative = useCallback(() => {
    try {
      nativeAudioRef?.current?.pause();
    } catch {
      /* ignore */
    }
  }, [nativeAudioRef]);

  const lang = direction === "rtl" ? "ar-SA" : "en-GB";
  const rtl = direction === "rtl";

  const { status, speak, stop, togglePause, isSupported, canSpeak } = useQuestionSpeech({
    text: plain,
    lang,
    resetKey: questionKey,
    rate,
    onBeforeSpeak: pauseNative,
  });

  if (!isSupported) {
    return null;
  }

  const playDisabled = !canSpeak;
  const pauseDisabled = status === "idle";
  const stopDisabled = status === "idle";

  return (
    <div
      className="mb-3 flex flex-wrap items-center gap-2 rounded-2xl border border-sky-200/80 bg-gradient-to-r from-sky-50 to-indigo-50/60 px-3 py-2 shadow-sm"
      role="region"
      aria-label={rtl ? "قراءة الفقرة صوتًا" : "Read paragraph aloud"}
    >
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-sky-800">
        <BiVolumeFull className="text-lg" aria-hidden />
        {rtl ? "الاستماع" : "Listen"}
      </span>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={speak}
          disabled={playDisabled}
          className="inline-flex items-center gap-1 rounded-xl bg-sky-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-45"
          aria-label={rtl ? "تشغيل القراءة" : "Play reading"}
        >
          <BiPlay className="text-base" aria-hidden />
          {rtl ? "تشغيل" : "Play"}
        </button>
        <button
          type="button"
          onClick={togglePause}
          disabled={pauseDisabled}
          className="inline-flex items-center gap-1 rounded-xl border border-sky-300 bg-white px-3 py-1.5 text-sm font-semibold text-sky-900 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-45"
          aria-label={rtl ? "إيقاف مؤقت أو استئناف" : "Pause or resume"}
          aria-pressed={status === "paused"}
        >
          <BiPause className="text-base" aria-hidden />
          {rtl ? (status === "paused" ? "استئناف" : "إيقاف مؤقت") : status === "paused" ? "Resume" : "Pause"}
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={stopDisabled}
          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-sm font-semibold text-rose-800 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-45"
          aria-label={rtl ? "إيقاف القراءة" : "Stop reading"}
        >
          <BiStop className="text-base" aria-hidden />
          {rtl ? "إيقاف" : "Stop"}
        </button>
      </div>

      <label className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-600">
        {rtl ? "السرعة" : "Speed"}
        <select
          value={String(rate)}
          onChange={(e) => setRate(Number(e.target.value))}
          className="rounded-lg border border-sky-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 shadow-inner"
          aria-label={rtl ? "سرعة القراءة" : "Reading speed"}
        >
          <option value="0.85">{rtl ? "بطيء" : "Slower"}</option>
          <option value="1">{rtl ? "عادي" : "Normal"}</option>
          <option value="1.15">{rtl ? "أسرع" : "Faster"}</option>
        </select>
      </label>
    </div>
  );
}
