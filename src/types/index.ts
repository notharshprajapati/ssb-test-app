// src/types/index.ts
export interface ImageFile {
  name: string; // Filename, e.g., "image1.jpg"
  path: string; // Path relative to /public, e.g., "/images/image1.jpg"
}

export interface ImageStat extends ImageFile {
  count: number;
  lastShown: number | null; // Timestamp or null if never shown
}

export type TestType = "PPDT" | "TAT";

export interface EmergencyExitRecord {
  timestamps: number[]; // Array of timestamps when exit was used
}

export type SortCriteria =
  | "default"
  | "newestShown"
  | "oldestShown"
  | "highestCount"
  | "lowestCount"
  | "name";
