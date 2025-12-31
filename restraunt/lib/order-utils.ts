import { OrderStatus } from '@/types';

/**
 * Format timestamp to readable time string
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Get elapsed time from order creation
 */
export function getElapsedTime(createdAt: number): string {
  const now = Date.now();
  const elapsed = Math.floor((now - createdAt) / 1000);

  if (elapsed < 60) {
    return `${elapsed}s ago`;
  }

  const minutes = Math.floor(elapsed / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

/**
 * Get status badge color
 */
export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    new: '#004E89', // Blue
    accepted: '#F59E0B', // Amber
    preparing: '#FF6B35', // Orange-Red
    ready: '#22C55E', // Green
    completed: '#687076', // Gray
    rejected: '#EF4444', // Red
  };
  return colors[status] || '#687076';
}

/**
 * Get status label
 */
export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    new: 'New Order',
    accepted: 'Accepted',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    completed: 'Completed',
    rejected: 'Rejected',
  };
  return labels[status] || status;
}

/**
 * Get next available status transitions
 */
export function getNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    new: ['accepted', 'rejected'],
    accepted: ['preparing'],
    preparing: ['ready'],
    ready: ['completed'],
    completed: [],
    rejected: [],
  };
  return transitions[currentStatus] || [];
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Get status progress percentage
 */
export function getStatusProgress(status: OrderStatus): number {
  const progress: Record<OrderStatus, number> = {
    new: 0,
    accepted: 25,
    preparing: 50,
    ready: 75,
    completed: 100,
    rejected: 0,
  };
  return progress[status] || 0;
}
