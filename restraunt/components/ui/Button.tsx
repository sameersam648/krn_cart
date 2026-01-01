import { ActivityIndicator, Text, TouchableOpacity, View, type TouchableOpacityProps } from 'react-native';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends TouchableOpacityProps {
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
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
        success: 'bg-success shadow-sm shadow-success/30',
        danger: 'bg-error shadow-sm shadow-error/30',
        outline: 'border-2 border-border bg-transparent',
        ghost: 'bg-transparent',
    };

    const sizes = {
        sm: 'px-3 py-2',
        md: 'px-4 py-3.5',
        lg: 'px-6 py-4',
        xl: 'px-8 py-5',
    };

    const textStyles = {
        primary: 'text-white font-bold',
        secondary: 'text-foreground font-semibold',
        success: 'text-white font-bold',
        danger: 'text-white font-bold',
        outline: 'text-foreground font-semibold',
        ghost: 'text-primary font-semibold',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
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
                <ActivityIndicator color={variant === 'primary' || variant === 'success' || variant === 'danger' ? '#fff' : '#FF6B35'} />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    <Text
                        className={cn(
                            'text-center',
                            textStyles[variant],
                            textSizes[size],
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
