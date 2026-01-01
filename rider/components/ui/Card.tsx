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
                variant === 'elevated' && 'bg-surface shadow-lg border border-border/50',
                variant === 'outlined' && 'border-2 border-border bg-surface',
                variant === 'ghost' && 'bg-surface/50',
                className
            )}
            style={style}
            {...props}
        />
    );
}
