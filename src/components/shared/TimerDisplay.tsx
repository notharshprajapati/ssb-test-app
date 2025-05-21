// src/components/shared/TimerDisplay.tsx
import React from "react";
import { formatTime } from "@/lib/time";

interface TimerDisplayProps {
  timeLeft: number;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  className,
}) => {
  return (
    <div className={`text-2xl font-mono ${className}`}>
      {formatTime(timeLeft)}
    </div>
  );
};
