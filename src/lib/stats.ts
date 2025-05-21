// src/lib/stats.ts
import { ImageFile, ImageStat } from "@/types";
import { LOCAL_STORAGE_STATS_KEY } from "./constants";

export function loadStatsFromLocalStorage(): ImageStat[] {
  const storedStats = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
  return storedStats ? JSON.parse(storedStats) : [];
}

export function saveStatsToLocalStorage(stats: ImageStat[]): void {
  localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(stats));
}

export function initializeOrUpdateStats(
  discoveredFiles: ImageFile[],
  currentStats: ImageStat[]
): ImageStat[] {
  const updatedStats: ImageStat[] = [];
  const discoveredFileNames = new Set(discoveredFiles.map((f) => f.name));

  // Update existing stats and add new files
  discoveredFiles.forEach((file) => {
    const existingStat = currentStats.find((stat) => stat.name === file.name);
    if (existingStat) {
      updatedStats.push({ ...existingStat, path: file.path }); // Ensure path is up-to-date
    } else {
      // New image
      updatedStats.push({
        ...file,
        count: 0,
        lastShown: null, // Or Date.now() if you want "detection time" to influence initial sort among new items
        // Using null makes it "oldest" among count 0 items if not shown yet.
        // If using Date.now(), change sort logic slightly for new items.
        // Per "New Image Stats: ... lastShown set to the current timestamp of detection/initialization."
        // Let's use Date.now() for `lastShown` on new images.
        // This implies that if multiple new images added, the one detected slightly earlier (if discernible) or alphabetically first gets picked.
        // The provided example had (image-5: 01/Feb, 0), (image-6: 20/Feb, 0) implying real dates.
        // Let's stick to null for truly "never shown", and update `lastShown` to `Date.now()` only when it's *actually* shown.
        // Initializing with `null` for `lastShown` and `0` for count correctly implements the described priority.
      });
    }
  });

  // Filter out stats for images that no longer exist
  return updatedStats.filter((stat) => discoveredFileNames.has(stat.name));
}

export function updateImageStatOnShow(
  imageName: string,
  currentStats: ImageStat[]
): ImageStat[] {
  return currentStats.map((stat) =>
    stat.name === imageName
      ? { ...stat, count: stat.count + 1, lastShown: Date.now() }
      : stat
  );
}

export function manuallyAdjustImageCount(
  imageName: string,
  delta: 1 | -1,
  currentStats: ImageStat[]
): ImageStat[] {
  return currentStats.map((stat) =>
    stat.name === imageName
      ? { ...stat, count: Math.max(0, stat.count + delta) } // Ensure count doesn't go below 0
      : stat
  );
}
