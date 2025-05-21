// src/components/shared/ProgressBar.tsx
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentTime: number; // Time elapsed or time left depending on how you calculate percentage
  duration: number;
  className?: string;
}

export const TestProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  className,
}) => {
  // Assuming currentTime is timeLeft
  const progressPercentage =
    duration > 0 ? ((duration - currentTime) / duration) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      <Progress value={progressPercentage} className="w-full h-3" />
    </div>
  );
};
