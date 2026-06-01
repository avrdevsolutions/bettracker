import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with conflict resolution.
 * cn('px-2 py-1', condition && 'px-4') → 'py-1 px-4'
 * clsx handles conditionals, twMerge resolves Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
