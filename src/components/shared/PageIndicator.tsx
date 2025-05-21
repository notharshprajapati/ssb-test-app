// src/components/shared/PageIndicator.tsx
import React from "react";
import { TestType } from "@/types";

interface PageIndicatorProps {
  testType: TestType;
  currentImageIndex?: number; // For TAT, 1-based index
  totalImages?: number; // For TAT, e.g., 11
  className?: string;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  testType,
  currentImageIndex,
  totalImages,
  className,
}) => {
  let text = testType === "PPDT" ? "PPDT" : "TAT";
  if (testType === "TAT" && currentImageIndex && totalImages) {
    text = `TAT: ${currentImageIndex}/${totalImages}`;
  }

  return <div className={`text-lg font-semibold ${className}`}>{text}</div>;
};
