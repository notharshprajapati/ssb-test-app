// src/hooks/useTimer.ts
import { useState, useEffect, useCallback, useRef } from "react";

interface UseTimerProps {
  duration: number;
  onEnd?: () => void;
  autoStart?: boolean;
}

export function useTimer({ duration, onEnd, autoStart = true }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    setTimeLeft(duration); // Reset time left when duration changes
    if (autoStart) setIsRunning(true);
    else setIsRunning(false);
  }, [duration, autoStart]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerIdRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft <= 0) {
      clearTimer();
      setIsRunning(false);
      if (onEnd) onEnd();
    }
    return clearTimer; // Cleanup on unmount or before next effect run
  }, [isRunning, timeLeft, onEnd, clearTimer]);

  const start = useCallback(() => {
    setTimeLeft(duration); // Reset to full duration on explicit start
    setIsRunning(true);
  }, [duration]);

  const manualStart = useCallback(() => setIsRunning(true), []); // Starts from current timeLeft
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(
    (newDuration?: number) => {
      clearTimer();
      setIsRunning(autoStart);
      setTimeLeft(newDuration ?? duration);
    },
    [duration, clearTimer, autoStart]
  );

  return { timeLeft, isRunning, start, pause, reset, manualStart };
}
