import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

type CardVariant = 'elevated' | 'outlined' | 'ghost';

interface CardProps extends ViewProps {
    variant?: CardVariant;
}

export function Card({ className, variant = 'elevated', style, ...props }: CardProps) {
    return (
        <View
            className={cn(
                'rounded-2xl p-4',
                variant === 'elevated' && 'bg-card shadow-sm border border-black/5 dark:border-white/10',
                variant === 'outlined' && 'border-2 border-border bg-transparent',
                variant === 'ghost' && 'bg-black/5 dark:bg-white/5',
                className
            )}
            style={style}
            {...props}
        />
    );
}
