import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { OrderType } from "@/lib/mock-data";

interface OrderTypeSelectorProps {
    selectedType: OrderType;
    onSelectType: (type: OrderType) => void;
}

export function OrderTypeSelector({ selectedType, onSelectType }: OrderTypeSelectorProps) {
    const orderTypes = [
        { type: 'quick' as OrderType, label: 'Quick', icon: '⚡', description: '10 mins' },
        { type: 'scheduled' as OrderType, label: 'Scheduled', icon: '📅', description: 'Later' },
        { type: 'regular' as OrderType, label: 'Regular', icon: '🔄', description: 'Subscribe' },
        { type: 'custom' as OrderType, label: 'Book Own', icon: '📸', description: 'Custom' },
    ];

    return (
        <View className="px-4 pb-3">
            <Text className="text-xs text-muted mb-2 font-semibold">ORDER TYPE</Text>
            <View className="flex-row justify-between gap-2">
                {orderTypes.map((orderType) => {
                    const isSelected = selectedType === orderType.type;
                    return (
                        <TouchableOpacity
                            key={orderType.type}
                            onPress={() => onSelectType(orderType.type)}
                            className={`flex-1 items-center py-3 px-2 rounded-lg border ${isSelected
                                    ? 'bg-primary border-primary'
                                    : 'bg-surface border-border'
                                } active:opacity-80`}
                        >
                            <Text className="text-2xl mb-1">{orderType.icon}</Text>
                            <Text
                                className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-foreground'
                                    }`}
                            >
                                {orderType.label}
                            </Text>
                            <Text
                                className={`text-[10px] ${isSelected ? 'text-white opacity-80' : 'text-muted'
                                    }`}
                            >
                                {orderType.description}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
