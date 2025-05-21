// src/components/shared/ImageDisplay.tsx
import React from "react";

interface ImageDisplayProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt,
  className,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`max-w-full max-h-full object-contain ${className}`}
    />
  );
};
