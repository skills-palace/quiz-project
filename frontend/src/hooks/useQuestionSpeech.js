import { useCallback, useEffect, useState } from "react";

/** Heuristic: Web Speech API has no gender field; match common vendor voice names. */
const FEMALE_NAME_HINTS =
  /female|woman|sonia|martha|serena|libby|maisie|nancy|amy|emma|olivia|susan|victoria|kate|hollie|pippa|sarah|linda/i;
const MALE_NAME_HINTS =
  /male\b|george|ryan|thomas|oliver|brian|arthur|daniel|james|alfred|william|harry|david|mark\b/i;

function isProbablyFemaleVoice(name = "") {
  if (MALE_NAME_HINTS.test(name)) return false;
  return FEMALE_NAME_HINTS.test(name);
}

function isBritishEnglishVoice(v) {
  const l = (v.lang || "").toLowerCase().replace(/_/g, "-");
  return l.startsWith("en-gb") || l.includes("-gb") || /\bgb\b/.test(l);
}

function pickVoice(bcp47) {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const tag = (bcp47 || "en-GB").toLowerCase();
  const primary = tag.split("-")[0] || "en";

  if (primary === "ar") {
    return (
      voices.find((v) => v.lang?.toLowerCase().startsWith("ar")) ||
      voices.find((v) => v.lang?.toLowerCase().includes("ar")) ||
      null
    );
  }

  if (primary === "en") {
    const british = voices.filter(isBritishEnglishVoice);
    if (british.length) {
      const femaleGb = british.find((v) => isProbablyFemaleVoice(v.name));
      return femaleGb || british[0];
    }
    const anyEn = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
    const femaleEn = anyEn.find((v) => isProbablyFemaleVoice(v.name));
    return femaleEn || anyEn[0] || voices[0];
  }

  return voices.find((v) => v.lang?.toLowerCase().startsWith(primary)) || voices[0];
}

/**
 * Browser Speech Synthesis for quiz question text.
 * @param {object} opts
 * @param {string} opts.text - plain text to read
 * @param {string} opts.lang - BCP 47, e.g. ar-SA, en-GB
 * @param {string|number} opts.resetKey - when this changes, speech is cancelled
 * @param {number} opts.rate - 0.1 .. 10, typically 0.8-1.2
 * @param {() => void} [opts.onBeforeSpeak] - e.g. pause native <audio>
 */
export function useQuestionSpeech({ text, lang, resetKey, rate = 1, onBeforeSpeak }) {
  const [status, setStatus] = useState("idle");
  /** false on SSR + first client paint so markup matches (avoids hydration mismatch). */
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && typeof window.speechSynthesis !== "undefined");
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }, []);

  const speak = useCallback(() => {
    if (!text || !isSupported) return;
    onBeforeSpeak?.();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || "en-GB";
    utterance.rate = Math.min(10, Math.max(0.1, rate));
    const voice = pickVoice(utterance.lang);
    if (voice) utterance.voice = voice;
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
    setStatus("playing");
  }, [text, lang, rate, isSupported, onBeforeSpeak]);

  const togglePause = useCallback(() => {
    if (!isSupported || !window.speechSynthesis.speaking) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setStatus("playing");
    } else {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return undefined;
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported]);

  useEffect(() => {
    if (!isSupported) return undefined;
    window.speechSynthesis.cancel();
    setStatus("idle");
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [resetKey, isSupported]);

  return {
    status,
    speak,
    stop,
    togglePause,
    isSupported,
    canSpeak: Boolean(text),
  };
}
