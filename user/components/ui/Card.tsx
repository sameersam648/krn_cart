import { View, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {
    className?: string;
    variant?: 'elevated' | 'outlined' | 'ghost';
}

export function Card({ className, variant = 'elevated', style, ...props }: CardProps) {
    return (
        <View
            className={cn(
                'rounded-2xl p-4',
                variant === 'elevated' && 'bg-card shadow-sm border border-black/5 dark:border-white/10',
                variant === 'outlined' && 'border border-border bg-transparent',
                variant === 'ghost' && 'bg-black/5 dark:bg-white/5',
                className
            )}
            style={style}
            {...props}
        />
    );
}
