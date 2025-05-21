// src/lib/constants.ts
export const PPDT_STAGES = {
  SHOW_IMAGE: { duration: 30, label: "Observe Image" }, // 30s
  WRITE_STORY: { duration: 4 * 60, label: "Write Story" }, // 4m
  REVISE_STORY: { duration: 4 * 60, label: "Revise Story" }, // 4m
  NARRATE: { duration: 1 * 60, label: "Narrate" }, // 1m
};

export const TAT_STAGES = {
  SHOW_IMAGE: { duration: 30, label: "Observe Image" }, // 30s
  WRITE_STORY: { duration: 4 * 60, label: "Write Story" }, // 4m
};
export const TAT_IMAGE_COUNT = 11;

export const COUNTDOWN_DURATION = 3; // 3 seconds for "3, 2, 1"
export const END_SCREEN_PAUSE = 3000; // 3 seconds

export const EMERGENCY_EXIT_LIMIT = 3;
export const EMERGENCY_EXIT_WINDOW_DAYS = 7; // Rolling 7 days

export const LOCAL_STORAGE_STATS_KEY = "ssbTestAppStats";
export const LOCAL_STORAGE_EXIT_KEY = "ssbTestAppExits";

export const SOUND_PATH = "/Page.mp3";
