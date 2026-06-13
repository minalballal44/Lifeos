import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXPForNextLevel(xp: number): number {
  const currentLevel = getLevelFromXP(xp);
  return currentLevel * 100;
}

export function getXPProgress(xp: number): number {
  const currentLevelXP = (getLevelFromXP(xp) - 1) * 100;
  const nextLevelXP = getXPForNextLevel(xp);
  return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
}

export const moodEmojis: Record<string, string> = {
  great: "😊",
  good: "🙂",
  okay: "😐",
  sad: "😔",
  stressed: "😫",
};

export const moodColors: Record<string, string> = {
  great: "#22c55e",
  good: "#84cc16",
  okay: "#eab308",
  sad: "#f97316",
  stressed: "#ef4444",
};

export const priorityColors: Record<string, string> = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  urgent: "#ef4444",
};

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}
