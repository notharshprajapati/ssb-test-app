// src/components/test/TestInstructions.tsx
import React from "react";

interface TestInstructionsProps {
  text: string;
  className?: string;
}

export const TestInstructions: React.FC<TestInstructionsProps> = ({
  text,
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full text-center ${className}`}
    >
      <h2 className="text-4xl font-semibold mb-8">{text}</h2>
      <p className="text-lg text-gray-600">Please use pen and paper.</p>
    </div>
  );
};
