/* ── AudioPlayback — plays TTS audio for AI responses ──── */
import { useState } from "react";
import { FiVolume2, FiVolumeX, FiLoader } from "react-icons/fi";
import { fetchTTS } from "../api";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

interface AudioPlaybackProps {
  text: string;
}

export default function AudioPlayback({ text }: AudioPlaybackProps) {
  const { isPlaying, isLoading: isAudioLoading, playBase64Audio, stopAudio } = useAudioPlayer();
  const [isFetching, setIsFetching] = useState(false);

  const busy = isFetching || isAudioLoading;

  const handlePlayAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsFetching(true);
    try {
      const { audio_base64, format } = await fetchTTS(text);
      playBase64Audio(audio_base64, format);
    } catch (err) {
      console.error("TTS failed:", err);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <button
      id="audio-playback-btn"
      onClick={handlePlayAudio}
      disabled={busy}
      title={isPlaying ? "Stop speaking" : "Listen to response"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 14px",
        borderRadius: "10px",
        border: "1px solid",
        borderColor: isPlaying ? "var(--accent-rose)" : "var(--border-color)",
        background: isPlaying
          ? "rgba(244, 63, 94, 0.1)"
          : "var(--bg-card)",
        color: isPlaying
          ? "var(--accent-rose)"
          : "var(--text-secondary)",
        fontSize: "12px",
        fontWeight: 600,
        cursor: busy ? "wait" : "pointer",
        transition: "all 0.25s ease",
        fontFamily: "inherit",
      }}
      onMouseOver={(e) => {
        if (!isPlaying && !busy) {
          e.currentTarget.style.borderColor = "var(--accent-indigo)";
          e.currentTarget.style.color = "var(--accent-indigo)";
          e.currentTarget.style.background = "rgba(99, 102, 241, 0.08)";
        }
      }}
      onMouseOut={(e) => {
        if (!isPlaying) {
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.color = "var(--text-secondary)";
          e.currentTarget.style.background = "var(--bg-card)";
        }
      }}
    >
      {busy ? (
        <>
          <FiLoader size={14} className="animate-spin" />
          Loading…
        </>
      ) : isPlaying ? (
        <>
          <FiVolumeX size={14} />
          Stop
        </>
      ) : (
        <>
          <FiVolume2 size={14} />
          Listen
        </>
      )}
    </button>
  );
}
