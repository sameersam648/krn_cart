import React from 'react';
import { Text, ActivityIndicator, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { cn } from '@/lib/utils';

interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    label: string;
    loading?: boolean;
    icon?: React.ReactNode;
    textClassName?: string;
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    label,
    loading = false,
    icon,
    textClassName,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'flex-row items-center justify-center rounded-xl transition-all active:opacity-80';

    const variants = {
        primary: 'bg-primary shadow-sm shadow-primary/30',
        secondary: 'bg-muted/10',
        outline: 'border border-border bg-transparent',
        ghost: 'bg-transparent',
        danger: 'bg-error',
    };

    const sizes = {
        sm: 'px-3 py-2',
        md: 'px-4 py-3.5',
        lg: 'px-6 py-4',
    };

    const textStyles = {
        primary: 'text-white font-semibold',
        secondary: 'text-foreground font-medium',
        outline: 'text-foreground font-medium',
        ghost: 'text-primary font-medium',
        danger: 'text-white font-semibold',
    };

    return (
        <TouchableOpacity
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                disabled || loading ? 'opacity-50' : '',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : '#FF6B35'} />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    <Text
                        className={cn(
                            'text-center text-base',
                            textStyles[variant],
                            size === 'sm' && 'text-sm',
                            textClassName
                        )}
                    >
                        {label}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}
