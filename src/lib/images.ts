// src/lib/images.ts
import { ImageFile, ImageStat } from "@/types";

// Vite-specific way to import all images from a directory
const imageModules = import.meta.glob(
  "/public/images/**/*.{png,jpg,jpeg,gif,svg}"
);

export async function discoverImageFiles(): Promise<ImageFile[]> {
  const imageFiles: ImageFile[] = [];
  for (const path in imageModules) {
    // path is like '/public/images/image1.jpg'
    // We want to extract 'image1.jpg' as name and keep path for src
    const fileName = path.split("/").pop();
    if (fileName) {
      imageFiles.push({
        name: fileName,
        path: path.replace("/public", ""), // Path for <img src="">
      });
    }
  }
  return imageFiles;
}

export function selectNextImage(stats: ImageStat[]): ImageStat | null {
  if (stats.length === 0) return null;

  // Sort: 1. Lowest count, 2. Oldest lastShown (nulls first), 3. Filename (for stability)
  const sortedStats = [...stats].sort((a, b) => {
    if (a.count !== b.count) {
      return a.count - b.count;
    }
    // Treat null lastShown as infinitely old
    const lastShownA = a.lastShown === null ? 0 : a.lastShown;
    const lastShownB = b.lastShown === null ? 0 : b.lastShown;
    if (lastShownA !== lastShownB) {
      return lastShownA - lastShownB;
    }
    return a.name.localeCompare(b.name); // Filename tie-breaker
  });

  return sortedStats[0];
}
