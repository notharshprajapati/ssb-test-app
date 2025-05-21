// src/hooks/useSound.ts
import { useCallback, useEffect, useRef } from "react";

export function useSound(soundSrc: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(soundSrc);
    audioRef.current.load(); // Preload
    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [soundSrc]);

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Rewind to start
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  }, []);

  return playSound;
}
