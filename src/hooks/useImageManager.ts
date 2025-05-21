// src/hooks/useImageManager.ts
import { useState, useEffect, useCallback } from "react";
import type { ImageFile, ImageStat } from "@/types";
import { discoverImageFiles, selectNextImage } from "@/lib/images";
import {
  loadStatsFromLocalStorage,
  saveStatsToLocalStorage,
  initializeOrUpdateStats,
  updateImageStatOnShow,
  manuallyAdjustImageCount,
} from "@/lib/stats";

export function useImageManager() {
  const [allImages, setAllImages] = useState<ImageStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadImagesAndStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const discoveredFiles = await discoverImageFiles();
      if (discoveredFiles.length === 0) {
        setError("No images found in /public/images/. Please add some images.");
        setAllImages([]);
        setIsLoading(false);
        return;
      }
      const storedStats = loadStatsFromLocalStorage();
      const initializedStats = initializeOrUpdateStats(
        discoveredFiles,
        storedStats
      );
      saveStatsToLocalStorage(initializedStats);
      setAllImages(initializedStats);
    } catch (e) {
      console.error("Error managing images:", e);
      setError("Failed to load or process images.");
      setAllImages([]); // Clear images on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadImagesAndStats();
  }, [reloadImagesAndStats]);

  const getNextImage = useCallback((): ImageStat | null => {
    if (allImages.length === 0) return null;
    return selectNextImage(allImages);
  }, [allImages]);

  const markImageAsShown = useCallback((imageName: string) => {
    setAllImages((prevStats) => {
      const updatedStats = updateImageStatOnShow(imageName, prevStats);
      saveStatsToLocalStorage(updatedStats);
      return updatedStats;
    });
  }, []);

  const adjustCountManually = useCallback(
    (imageName: string, delta: 1 | -1) => {
      setAllImages((prevStats) => {
        const updatedStats = manuallyAdjustImageCount(
          imageName,
          delta,
          prevStats
        );
        saveStatsToLocalStorage(updatedStats);
        return updatedStats;
      });
    },
    []
  );

  return {
    images: allImages,
    isLoading,
    error,
    getImageCount: allImages.length,
    getNextImage,
    markImageAsShown,
    adjustCountManually,
    reloadImagesAndStats, // Expose for a potential manual refresh button
  };
}
