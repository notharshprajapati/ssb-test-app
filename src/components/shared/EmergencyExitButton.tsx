// src/components/shared/EmergencyExitButton.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEmergencyExit } from "@/hooks/useEmergencyExit";
import { XCircle } from "lucide-react"; // npm install lucide-react

interface EmergencyExitButtonProps {
  onExit: () => void;
  className?: string;
}

export const EmergencyExitButton: React.FC<EmergencyExitButtonProps> = ({
  onExit,
  className,
}) => {
  const { canUseExit, recordExit, getRemainingExits } = useEmergencyExit();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleExitClick = () => {
    if (canUseExit()) {
      setIsAlertOpen(true);
    } else {
      alert(
        `Emergency exit limit reached. Available uses: ${getRemainingExits()}`
      );
    }
  };

  const confirmExit = () => {
    if (recordExit()) {
      onExit();
    }
    setIsAlertOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExitClick}
        className={` ${className}`}
        title={`Emergency Exit (${getRemainingExits()} remaining)`}
      >
        <XCircle className="h-6 w-6 text-red-500" />
      </Button>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Emergency Exit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to exit the test? Progress for images
              already shown will be saved. You have {getRemainingExits()}{" "}
              exit(s) remaining this week.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmExit}
              className="bg-red-500 hover:bg-red-600"
            >
              Confirm Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
