import { AdvanceBooking } from '@/app/context/AdvanceBookingContext';

/**
 * Generate a random 4-digit secret code
 */
export function generateSecretCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/**
 * Format booking amount as currency
 */
export function formatAmount(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}

/**
 * Format date and time
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get status badge text and color
 */
export function getStatusBadge(status: AdvanceBooking['status']): {
  text: string;
  className: string;
} {
  switch (status) {
    case 'ready':
      return { text: 'Ready for Pickup', className: 'bg-green-100 text-green-800' };
    case 'picked_up':
      return { text: 'Picked Up', className: 'bg-blue-100 text-blue-800' };
    case 'cancelled':
      return { text: 'Cancelled', className: 'bg-red-100 text-red-800' };
    default:
      return { text: 'Pending', className: 'bg-gray-100 text-gray-800' };
  }
}

/**
 * Calculate total quantity of items
 */
export function calculateTotalItems(items: AdvanceBooking['items']): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Validate secret code format (4-digit numeric)
 */
export function isValidSecretCodeFormat(code: string): boolean {
  return /^\d{4}$/.test(code);
}

/**
 * Format PUDS ID for display
 */
export function formatPudsId(pudsId: string): string {
  // Extract just the numeric part or show as-is
  if (pudsId.startsWith('PUDS-')) {
    return pudsId.substring(5);
  }
  return pudsId;
}

/**
 * Get time remaining for terminal lock (in seconds)
 */
export function getTimeRemainingForLock(lockUntil: number | undefined): number {
  if (!lockUntil) return 0;
  const remaining = lockUntil - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000));
}
