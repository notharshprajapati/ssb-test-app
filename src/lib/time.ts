// src/lib/time.ts
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export function formatTimestamp(timestamp: number | null): string {
  if (timestamp === null) return "Never";
  return new Date(timestamp).toLocaleString();
}
