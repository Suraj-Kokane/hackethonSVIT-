/* ── useAudioPlayer — plays base64 or URL audio ────────── */
import { useState, useRef, useCallback } from "react";

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
}

export interface AudioPlayerActions {
  playBase64Audio: (base64: string, format?: string) => void;
  stopAudio: () => void;
}

export function useAudioPlayer(): AudioPlayerState & AudioPlayerActions {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  const playBase64Audio = useCallback(
    (base64: string, format: string = "mp3") => {
      // Stop any currently playing audio
      stopAudio();

      if (!base64) return;

      setIsLoading(true);

      const audio = new Audio(`data:audio/${format};base64,${base64}`);
      audioRef.current = audio;

      audio.oncanplaythrough = () => {
        setIsLoading(false);
        setIsPlaying(true);
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      };

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        audioRef.current = null;
      };

      // Trigger load
      audio.load();
    },
    [stopAudio]
  );

  return {
    isPlaying,
    isLoading,
    playBase64Audio,
    stopAudio,
  };
}
