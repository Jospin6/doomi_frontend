import { clsx, type ClassValue } from "clsx"
import { SignJWT } from "jose";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateToMonthYear(dateStr: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
  };

  // Format avec locale française pour "sept." au lieu de "Sep"
  const formatted = date.toLocaleDateString('en-US', options);

  // Capitaliser le premier caractère du mois (ex: sept → Sept)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
export const transformStringToArray = (input: string): string[] => {
  return input
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");
};

export function formatDateToFullYear(dateInput: string | number, language: string): string {
  const date = new Date(dateInput);
  const lang = `${language}-${language === 'fr' ? 'FR' : 'US'}`;
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  return date.toLocaleDateString(lang, options);
}

export function capitalize(text?: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export async function createUniqueSlug(name: string, productId: string) {
  const baseSlug = generateSlug(name);
  return `${baseSlug}-${productId.slice(0, 4)}`; // Ex: "chaise-gaming-a3b1"
}

export const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[éèêë]/g, 'e')
      .replace(/[àäâ]/g, 'a')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };