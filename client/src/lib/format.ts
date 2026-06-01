/**
 * Format a number as currency (GBP).
 * Handles string values from API (PostgreSQL DECIMAL comes as string).
 */
export function formatCurrency(amount: number | string): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

/**
 * Format odds for display (e.g., 1.50).
 * Handles string values from API (PostgreSQL DECIMAL comes as string).
 */
export function formatOdds(odds: number | string): string {
  return Number(odds).toFixed(2);
}

/**
 * Format an ISO date string to a readable format.
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

/**
 * Format a relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31_536_000 },
    { label: 'month', seconds: 2_592_000 },
    { label: 'day', seconds: 86_400 },
    { label: 'hour', seconds: 3_600 },
    { label: 'minute', seconds: 60 },
  ] as const;

  for (const { label, seconds: intervalSeconds } of intervals) {
    const count = Math.floor(seconds / intervalSeconds);
    if (count >= 1) {
      return `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}
