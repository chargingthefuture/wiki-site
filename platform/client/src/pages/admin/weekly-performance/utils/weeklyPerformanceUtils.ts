/**
 * Utility functions for weekly performance page
 */

export function formatPercentage(value: number): string {
  const sign = value > 0 ? "+" : ""; // zero no sign
  return `${sign}${value.toFixed(1)}%`;
}

export function calculateDauChange(
  currentWeekTotalDAU: number,
  previousWeekTotalDAU: number
): number {
  if (previousWeekTotalDAU === 0) {
    return currentWeekTotalDAU > 0 ? 100 : 0;
  }
  return ((currentWeekTotalDAU - previousWeekTotalDAU) / previousWeekTotalDAU) * 100;
}

export function getPreviousWeekMood(
  currentMood: number | undefined,
  moodChange: number | undefined
): number | null {
  if (currentMood !== undefined && moodChange !== undefined && typeof moodChange === "number") {
    return currentMood - moodChange;
  }
  return null;
}
