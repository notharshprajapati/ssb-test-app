// src/components/shared/Countdown.tsx
import React, { useState, useEffect } from "react";
import { COUNTDOWN_DURATION } from "@/lib/constants";

interface CountdownProps {
  onComplete: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ onComplete }) => {
  const [count, setCount] = useState(COUNTDOWN_DURATION);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (count > 0) {
      setMessage(String(count));
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      setMessage("Ready!");
      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // Show "Ready!" for 1 second
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-6xl font-bold">{message}</h1>
    </div>
  );
};
