// src/pages/TestPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { TestType, ImageStat } from "@/types";
import { useImageManager } from "@/hooks/useImageManager";
import { useTimer } from "@/hooks/useTimer";
import { useSound } from "@/hooks/useSound";
import { Countdown } from "@/components/shared/Countdown";
import { ImageDisplay } from "@/components/shared/ImageDisplay";
import { TestInstructions } from "@/components/test/TestInstructions";
import { PageIndicator } from "@/components/shared/PageIndicator";
import { EmergencyExitButton } from "@/components/shared/EmergencyExitButton";
import { TestProgressBar } from "@/components/shared/ProgressBar";
import { TimerDisplay } from "@/components/shared/TimerDisplay";
import {
  PPDT_STAGES,
  TAT_STAGES,
  TAT_IMAGE_COUNT,
  COUNTDOWN_DURATION, // Not used directly here, Countdown handles it
  END_SCREEN_PAUSE,
  SOUND_PATH,
} from "@/lib/constants";

type Stage =
  | "countdown"
  | "showImage"
  | "writeStory"
  | "reviseStory" // PPDT only
  | "narrate" // PPDT only
  | "end";

export const TestPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { testType } = (location.state as { testType: TestType }) || {
    testType: "PPDT",
  };

  const { getNextImage, markImageAsShown, getImageCount } = useImageManager();
  const playSound = useSound(SOUND_PATH);

  const [currentStage, setCurrentStage] = useState<Stage>("countdown");
  const [currentImage, setCurrentImage] = useState<ImageStat | null>(null);
  const [tatImageIndex, setTatImageIndex] = useState(0); // 0-indexed for internal, 1-indexed for display

  // This will hold images shown in current session for TAT, to ensure stats are updated ONLY for them if exited early
  const [shownTatImagesInSession, setShownTatImagesInSession] = useState<
    string[]
  >([]);

  const stageConfig = testType === "PPDT" ? PPDT_STAGES : TAT_STAGES;
  let currentDuration = 0;
  if (currentStage === "showImage")
    currentDuration = stageConfig.SHOW_IMAGE.duration;
  if (currentStage === "writeStory")
    currentDuration = stageConfig.WRITE_STORY.duration;
  if (testType === "PPDT" && currentStage === "reviseStory")
    currentDuration = PPDT_STAGES.REVISE_STORY.duration;
  if (testType === "PPDT" && currentStage === "narrate")
    currentDuration = PPDT_STAGES.NARRATE.duration;

  const handleStageEnd = useCallback(() => {
    playSound();
    // Logic to transition to next stage
    if (testType === "PPDT") {
      if (currentStage === "showImage") setCurrentStage("writeStory");
      else if (currentStage === "writeStory") setCurrentStage("reviseStory");
      else if (currentStage === "reviseStory") setCurrentStage("narrate");
      else if (currentStage === "narrate") setCurrentStage("end");
    } else {
      // TAT
      if (currentStage === "showImage") setCurrentStage("writeStory");
      else if (currentStage === "writeStory") {
        if (tatImageIndex < TAT_IMAGE_COUNT - 1) {
          const nextTatIdx = tatImageIndex + 1;
          setTatImageIndex(nextTatIdx);
          const nextImg = getNextImage();
          if (nextImg) {
            setCurrentImage(nextImg);
            markImageAsShown(nextImg.name);
            setShownTatImagesInSession((prev) => [...prev, nextImg.name]);
            setCurrentStage("showImage");
          } else {
            // No more images available
            setCurrentStage("end");
          }
        } else {
          // All TAT images done
          setCurrentStage("end");
        }
      }
    }
  }, [
    currentStage,
    testType,
    playSound,
    tatImageIndex,
    getNextImage,
    markImageAsShown,
  ]);

  const {
    timeLeft,
    reset: resetTimer,
    manualStart: startCurrentTimer,
    pause: pauseCurrentTimer,
  } = useTimer({
    duration: currentDuration,
    onEnd: handleStageEnd,
    autoStart: false, // We will manually start timer when stage begins
  });

  useEffect(() => {
    // Manage timer restart when stage or duration changes
    if (
      currentStage !== "countdown" &&
      currentStage !== "end" &&
      currentDuration > 0
    ) {
      resetTimer(currentDuration);
      startCurrentTimer();
    }
  }, [currentStage, currentDuration, resetTimer, startCurrentTimer]);

  const startTestFlow = useCallback(() => {
    playSound();
    const img = getNextImage();
    if (!img) {
      alert("No images available for the test.");
      navigate("/");
      return;
    }
    setCurrentImage(img);
    markImageAsShown(img.name);
    if (testType === "TAT") {
      setTatImageIndex(0);
      setShownTatImagesInSession([img.name]);
    }
    setCurrentStage("showImage");
  }, [playSound, getNextImage, markImageAsShown, testType, navigate]);

  useEffect(() => {
    if (currentStage === "end") {
      const timer = setTimeout(() => navigate("/"), END_SCREEN_PAUSE);
      return () => clearTimeout(timer);
    }
  }, [currentStage, navigate]);

  // Emergency Exit: Stats are updated per image when it's shown.
  // No special handling needed for stats on exit, as markImageAsShown is called immediately.
  const handleEmergencyExit = () => {
    pauseCurrentTimer(); // Stop any active timers
    navigate("/");
  };

  // Ensure at least one image for PPDT or enough for TAT (though getNextImage handles running out)
  useEffect(() => {
    if (getImageCount === 0) {
      alert("No images available. Please add images.");
      navigate("/");
    } else if (testType === "TAT" && getImageCount < TAT_IMAGE_COUNT) {
      // Optional: Warn user if not enough images for a full TAT session
      // console.warn(`Warning: Only ${getImageCount} images available for TAT, less than the required ${TAT_IMAGE_COUNT}.`);
    }
  }, [getImageCount, testType, navigate]);

  // Render logic
  const renderContent = () => {
    switch (currentStage) {
      case "countdown":
        return <Countdown onComplete={startTestFlow} />;
      case "showImage":
        return currentImage ? (
          <ImageDisplay
            src={currentImage.path}
            alt={currentImage.name}
            className="p-4"
          />
        ) : null;
      case "writeStory":
        return (
          <TestInstructions
            text={
              testType === "PPDT"
                ? PPDT_STAGES.WRITE_STORY.label
                : TAT_STAGES.WRITE_STORY.label
            }
          />
        );
      case "reviseStory": // PPDT only
        return <TestInstructions text={PPDT_STAGES.REVISE_STORY.label} />;
      case "narrate": // PPDT only
        return <TestInstructions text={PPDT_STAGES.NARRATE.label} />;
      case "end":
        return (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-5xl font-bold">The END</h1>
          </div>
        );
      default:
        return null;
    }
  };

  if (!testType) {
    // Should not happen if navigation is correct
    navigate("/");
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      {currentStage !== "countdown" && currentStage !== "end" && (
        <header className="flex items-center justify-between p-3 border-b">
          <PageIndicator
            testType={testType}
            currentImageIndex={
              testType === "TAT" ? tatImageIndex + 1 : undefined
            }
            totalImages={testType === "TAT" ? TAT_IMAGE_COUNT : undefined}
          />
          {(currentStage === "writeStory" ||
            currentStage === "reviseStory" ||
            currentStage === "narrate") && <TimerDisplay timeLeft={timeLeft} />}
          <EmergencyExitButton onExit={handleEmergencyExit} />
        </header>
      )}

      <main className="flex-grow flex items-center justify-center overflow-hidden relative">
        {renderContent()}
      </main>

      {currentStage !== "countdown" &&
        currentStage !== "end" &&
        currentDuration > 0 && (
          <footer className="p-3 border-t">
            <TestProgressBar
              currentTime={timeLeft}
              duration={currentDuration}
            />
          </footer>
        )}
    </div>
  );
};
