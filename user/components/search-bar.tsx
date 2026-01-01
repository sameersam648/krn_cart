import React from "react";
import { TextInput, View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search for food..." }: SearchBarProps) {
    return (
        <View className="mb-2">
            <View className="flex-row items-center bg-surface border border-border/60 rounded-xl px-4 py-3 shadow-sm shadow-black/5">
                <Ionicons name="search" size={20} color="#94A3B8" className="mr-2" />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-foreground text-base leading-5"
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeText("")} className="ml-2 bg-muted/20 rounded-full p-1">
                        <Ionicons name="close" size={16} color="#64748B" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
