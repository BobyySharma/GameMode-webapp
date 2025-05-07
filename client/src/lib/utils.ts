import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isYesterday, addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MMM d, yyyy");
  }
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

export function formatDateForInput(dateString: string): string {
  return dateString; // It's already in YYYY-MM-DD format
}

export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function calculateXpForLevel(level: number): number {
  return level * 100;
}

export function getRankTitle(level: number): string {
  const ranks = [
    "Novice",
    "Adventurer",
    "Explorer",
    "Challenger",
    "Champion",
    "Hero",
    "Legend",
    "Mythic",
    "Grandmaster",
    "Divine"
  ];
  
  // Ensure we stay within the array bounds
  const index = Math.min(Math.floor((level - 1) / 3), ranks.length - 1);
  return ranks[index];
}
