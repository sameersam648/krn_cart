import { type OrderStatus } from '@/lib/order-context';

// Status workflow steps
export const STATUS_STEPS: OrderStatus[] = [
    'accepted',
    'reached_restaurant',
    'picked_up',
    'on_the_way',
    'delivered',
];

// Status labels
export const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Pending',
    accepted: 'Accepted',
    reached_restaurant: 'Reached Restaurant',
    picked_up: 'Picked Up',
    on_the_way: 'On the Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

// Status colors for legacy components
export const STATUS_COLORS: Record<OrderStatus, string> = {
    pending: 'bg-gray-500',
    accepted: 'bg-blue-500',
    reached_restaurant: 'bg-orange-500',
    picked_up: 'bg-purple-500',
    on_the_way: 'bg-indigo-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
};

// Time formatting
export function formatElapsedTime(dateString: string): string {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
}

// Maps URL generator
export function generateMapsUrl(lat: number, lng: number): string {
    return `https://maps.google.com/?q=${lat},${lng}`;
}

// Currency formatting
export function formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
}
