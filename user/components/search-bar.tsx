import React from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search restaurants..." }: SearchBarProps) {
    return (
        <View className="px-4 py-2">
            <View className="flex-row items-center bg-surface border border-border rounded-lg px-3 py-2">
                <Text className="text-muted mr-2">🔍</Text>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-foreground text-base"
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeText("")} className="ml-2">
                        <Text className="text-muted">✕</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
