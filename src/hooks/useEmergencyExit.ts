// src/hooks/useEmergencyExit.ts
import { useState, useEffect, useCallback } from "react";
import type { EmergencyExitRecord } from "@/types";
import {
  LOCAL_STORAGE_EXIT_KEY,
  EMERGENCY_EXIT_LIMIT,
  EMERGENCY_EXIT_WINDOW_DAYS,
} from "@/lib/constants";

export function useEmergencyExit() {
  const [exitRecords, setExitRecords] = useState<EmergencyExitRecord>({
    timestamps: [],
  });

  useEffect(() => {
    const storedExits = localStorage.getItem(LOCAL_STORAGE_EXIT_KEY);
    if (storedExits) {
      setExitRecords(JSON.parse(storedExits));
    }
  }, []);

  const saveExitRecords = useCallback((records: EmergencyExitRecord) => {
    localStorage.setItem(LOCAL_STORAGE_EXIT_KEY, JSON.stringify(records));
    setExitRecords(records);
  }, []);

  const canUseExit = useCallback(() => {
    const now = Date.now();
    const oneWeekAgo = now - EMERGENCY_EXIT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    const recentExits = exitRecords.timestamps.filter((ts) => ts > oneWeekAgo);
    return recentExits.length < EMERGENCY_EXIT_LIMIT;
  }, [exitRecords.timestamps]);

  const recordExit = useCallback(() => {
    if (canUseExit()) {
      const now = Date.now();
      const oneWeekAgo = now - EMERGENCY_EXIT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
      // Filter out old timestamps and add new one
      const updatedTimestamps = exitRecords.timestamps.filter(
        (ts) => ts > oneWeekAgo
      );
      updatedTimestamps.push(now);
      saveExitRecords({ timestamps: updatedTimestamps });
      return true;
    }
    return false;
  }, [exitRecords.timestamps, canUseExit, saveExitRecords]);

  const getRemainingExits = useCallback(() => {
    const now = Date.now();
    const oneWeekAgo = now - EMERGENCY_EXIT_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    const recentExitsCount = exitRecords.timestamps.filter(
      (ts) => ts > oneWeekAgo
    ).length;
    return Math.max(0, EMERGENCY_EXIT_LIMIT - recentExitsCount);
  }, [exitRecords.timestamps]);

  return { canUseExit, recordExit, getRemainingExits };
}
