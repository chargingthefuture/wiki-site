import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function estimateReadTime(textLength: number): number {
  const wordsPerMinute = 200;
  const words = textLength / 5; // Rough estimate of chars per word
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}
