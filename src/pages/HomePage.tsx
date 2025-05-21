// src/pages/HomePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useImageManager } from "@/hooks/useImageManager";
import { TestType } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const HomePage: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<TestType>("PPDT");
  const navigate = useNavigate();
  const {
    getImageCount,
    isLoading,
    error: imageManagerError,
  } = useImageManager();

  const handleStartTest = () => {
    if (getImageCount > 0 && !imageManagerError) {
      navigate("/test", { state: { testType: selectedTest } });
    } else {
      alert(
        imageManagerError ||
          "No images available to start the test. Please add images to the public/images folder and refresh."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            SSB Practice Test
          </CardTitle>
          <CardDescription className="text-center">
            Select a test type and begin your practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-2">
            <label className="text-sm font-medium">Select Test Type:</label>
            <ToggleGroup
              type="single"
              value={selectedTest}
              onValueChange={(value) => {
                if (value) setSelectedTest(value as TestType);
              }}
              className="w-full"
            >
              <ToggleGroupItem
                value="PPDT"
                aria-label="PPDT"
                className="flex-1"
              >
                PPDT
              </ToggleGroupItem>
              <ToggleGroupItem value="TAT" aria-label="TAT" className="flex-1">
                TAT
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="text-center">
            {isLoading && <p>Loading images...</p>}
            {imageManagerError && (
              <p className="text-red-500">{imageManagerError}</p>
            )}
            {!isLoading && !imageManagerError && (
              <p className="text-sm text-gray-600">
                Available Images: {getImageCount}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleStartTest}
            className="w-full"
            disabled={isLoading || getImageCount === 0 || !!imageManagerError}
          >
            Start {selectedTest} Test
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/stats")}
            className="w-full"
          >
            View Statistics
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
