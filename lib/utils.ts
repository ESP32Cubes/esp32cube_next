import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Class name utility
