import { format } from 'date-fns';

function toSafeDate(input?: string | Date): Date {
  const candidate = input instanceof Date ? input : input ? new Date(input) : new Date();
  return isNaN(candidate.getTime()) ? new Date() : candidate;
}

// Formats an ISO string (or Date) into a human-readable date (e.g., Sep 13, 2025).
// Falls back to current date if input is undefined/invalid to keep previews stable.
export function fromIsoToReadableDate(input?: string | Date): string {
  return format(toSafeDate(input), 'PP');
}

// Short numeric date format (e.g., 09/13/2025)
export function fromIsoToShortDate(input?: string | Date): string {
  return format(toSafeDate(input), 'P');
}
