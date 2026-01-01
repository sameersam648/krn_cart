import { View, Text } from 'react-native';
import { cn } from '@/lib/utils';

type OrderStatus =
    | 'pending'
    | 'accepted'
    | 'reached_restaurant'
    | 'picked_up'
    | 'on_the_way'
    | 'delivered'
    | 'cancelled';

interface StatusBadgeProps {
    status: OrderStatus;
    size?: 'small' | 'medium' | 'large';
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-muted', bg: 'bg-muted/20' },
    accepted: { label: 'Accepted', color: 'text-blue-600', bg: 'bg-blue-500/20' },
    reached_restaurant: { label: 'At Restaurant', color: 'text-orange-600', bg: 'bg-orange-500/20' },
    picked_up: { label: 'Picked Up', color: 'text-purple-600', bg: 'bg-purple-500/20' },
    on_the_way: { label: 'On the Way', color: 'text-indigo-600', bg: 'bg-indigo-500/20' },
    delivered: { label: 'Delivered', color: 'text-success', bg: 'bg-success/20' },
    cancelled: { label: 'Cancelled', color: 'text-error', bg: 'bg-error/20' },
};

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
    const config = STATUS_CONFIG[status];

    const sizeClasses = {
        small: 'px-2 py-1',
        medium: 'px-3 py-1.5',
        large: 'px-4 py-2',
    };

    const textSizes = {
        small: 'text-xs',
        medium: 'text-sm',
        large: 'text-base',
    };

    return (
        <View className={cn('rounded-full', config.bg, sizeClasses[size])}>
            <Text className={cn('font-bold uppercase tracking-wide', config.color, textSizes[size])}>
                {config.label}
            </Text>
        </View>
    );
}
