import { TextInput, View, Text, TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    containerClassName?: string;
}

export function Input({
    className,
    label,
    error,
    icon,
    containerClassName,
    onFocus,
    onBlur,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className={cn('w-full space-y-1.5', containerClassName)}>
            {label && (
                <Text className="text-sm font-medium text-foreground/80 ml-1">
                    {label}
                </Text>
            )}
            <View
                className={cn(
                    'flex-row items-center rounded-xl border bg-surface px-3 py-3.5 transition-all',
                    isFocused ? 'border-primary ring-1 ring-primary/20' : 'border-border',
                    error ? 'border-error' : '',
                    props.editable === false && 'bg-muted/10 opacity-75'
                )}
            >
                {icon && <View className="mr-3 text-muted-foreground">{icon}</View>}
                <TextInput
                    className={cn(
                        'flex-1 text-base text-foreground placeholder:text-muted-foreground/50',
                        className
                    )}
                    placeholderTextColor="#94A3B8"
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    style={{ includeFontPadding: false }} // Android fix
                    {...props}
                />
            </View>
            {error && (
                <Text className="text-xs text-error font-medium ml-1">
                    {error}
                </Text>
            )}
        </View>
    );
}
