// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fungsi gabungan class Tailwind yang aman.
 * Menghindari duplikasi dan konflik antar class.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
