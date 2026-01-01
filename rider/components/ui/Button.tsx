import { ActivityIndicator, Text, TouchableOpacity, View, type TouchableOpacityProps } from 'react-native';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'md' | 'lg' | 'xl';

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
    size = 'lg',
    label,
    loading = false,
    icon,
    textClassName,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'flex-row items-center justify-center rounded-xl transition-all active:opacity-80';

    const variants = {
        primary: 'bg-primary shadow-md shadow-primary/30',
        secondary: 'bg-surface border-2 border-border',
        success: 'bg-success shadow-md shadow-success/30',
        danger: 'bg-error shadow-md shadow-error/30',
        outline: 'border-2 border-primary bg-transparent',
        ghost: 'bg-transparent',
    };

    const sizes = {
        md: 'px-5 py-3',
        lg: 'px-6 py-4', // Large for one-hand usage
        xl: 'px-8 py-5', // Extra large for gloved hands
    };

    const textStyles = {
        primary: 'text-white font-bold',
        secondary: 'text-foreground font-bold',
        success: 'text-white font-bold',
        danger: 'text-white font-bold',
        outline: 'text-primary font-bold',
        ghost: 'text-primary font-semibold',
    };

    const textSizes = {
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
