import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGreeting(): string {
  const currentHour = new Date().getHours()
  // Utilisons 17h comme basculement conventionnel vers "Bonsoir"
  if (currentHour >= 17 || currentHour < 5) {
    return 'Bonsoir'
  }
  return 'Bonjour'
}
