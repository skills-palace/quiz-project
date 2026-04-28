import React, { useState, useRef } from "react";
import { FaPause } from "react-icons/fa";
import { AiFillSound } from "react-icons/ai"; // React icon for sound

export default function AudioPlayer({ audioPath }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Handle audio play/pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying); // Toggle playing state
  };

  // Handle when audio ends to reset the play state
  const handleAudioEnd = () => {
    setIsPlaying(false); // Reset playing state when audio ends
  };
  if (!audioPath) {
    return;
  }
  return (
    <div className="audio-player flex flex-wrap items-center gap-3 mb-2">
      <button
        type="button"
        onClick={togglePlay}
        className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white text-2xl shadow-md hover:bg-sky-600 active:scale-95 transition"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
      >
        {isPlaying ? <FaPause /> : <AiFillSound />}
      </button>

      {/* Hidden audio element */}
      <audio
        // autoPlay
        ref={audioRef}
        onEnded={handleAudioEnd} // Reset state when audio ends
        src={`${process.env.NEXT_PUBLIC_BASE_URL}/${audioPath}`}
      />

      {/* Optional visual feedback for playing */}
      {isPlaying && (
        <span className="animate-pulse text-base font-semibold text-sky-700 font-sans">Playing…</span>
      )}
    </div>
  );
}
