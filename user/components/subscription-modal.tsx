import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, ScrollView } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { SubscriptionData } from "@/lib/mock-data";

interface SubscriptionModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (data: SubscriptionData) => void;
}

export function SubscriptionModal({ isVisible, onClose, onConfirm }: SubscriptionModalProps) {
    const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
    });
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleStartDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowStartDatePicker(Platform.OS === 'ios');
        if (date) {
            setStartDate(date);
            // Ensure end date is after start date
            if (date >= endDate) {
                const newEndDate = new Date(date);
                newEndDate.setMonth(newEndDate.getMonth() + 1);
                setEndDate(newEndDate);
            }
        }
    };

    const handleEndDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowEndDatePicker(Platform.OS === 'ios');
        if (date && date > startDate) {
            setEndDate(date);
        }
    };

    const calculateOccurrences = (): number => {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (frequency === 'weekly') {
            return Math.ceil(diffDays / 7);
        } else {
            return Math.ceil(diffDays / 30);
        }
    };

    const handleConfirm = () => {
        if (startDate >= endDate) {
            alert("End date must be after start date");
            return;
        }

        const occurrences = calculateOccurrences();

        const subscriptionData: SubscriptionData = {
            frequency,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            occurrences,
        };

        onConfirm(subscriptionData);
        onClose();
    };

    const occurrences = calculateOccurrences();

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} className="m-0 justify-end">
            <View className="bg-background rounded-t-3xl p-6 pb-8 max-h-[80%]">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-2xl font-bold text-foreground mb-2">Regular Subscription</Text>
                    <Text className="text-sm text-muted mb-6">Set up a recurring order schedule</Text>

                    {/* Warning about payment */}
                    <View className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-6">
                        <Text className="text-warning text-xs font-semibold">⚠️ PREPAYMENT REQUIRED</Text>
                        <Text className="text-warning/80 text-xs mt-1">
                            Cash on Delivery is not available for subscription orders. Payment is required upfront.
                        </Text>
                    </View>

                    {/* Frequency Selection */}
                    <View className="mb-6">
                        <Text className="text-sm font-semibold text-foreground mb-3">Frequency</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setFrequency('weekly')}
                                className={`flex-1 py-3 px-4 rounded-lg border ${frequency === 'weekly'
                                        ? 'bg-primary border-primary'
                                        : 'bg-surface border-border'
                                    } active:opacity-80`}
                            >
                                <Text
                                    className={`text-center font-semibold ${frequency === 'weekly' ? 'text-white' : 'text-foreground'
                                        }`}
                                >
                                    Weekly
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setFrequency('monthly')}
                                className={`flex-1 py-3 px-4 rounded-lg border ${frequency === 'monthly'
                                        ? 'bg-primary border-primary'
                                        : 'bg-surface border-border'
                                    } active:opacity-80`}
                            >
                                <Text
                                    className={`text-center font-semibold ${frequency === 'monthly' ? 'text-white' : 'text-foreground'
                                        }`}
                                >
                                    Monthly
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Start Date */}
                    <View className="mb-4">
                        <Text className="text-sm font-semibold text-foreground mb-2">Start Date</Text>
                        <TouchableOpacity
                            onPress={() => setShowStartDatePicker(true)}
                            className="bg-surface border border-border rounded-lg p-4"
                        >
                            <Text className="text-foreground">{startDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={handleStartDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* End Date */}
                    <View className="mb-6">
                        <Text className="text-sm font-semibold text-foreground mb-2">End Date</Text>
                        <TouchableOpacity
                            onPress={() => setShowEndDatePicker(true)}
                            className="bg-surface border border-border rounded-lg p-4"
                        >
                            <Text className="text-foreground">{endDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showEndDatePicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={handleEndDateChange}
                                minimumDate={new Date(startDate.getTime() + 86400000)} // Next day
                            />
                        )}
                    </View>

                    {/* Summary */}
                    <View className="bg-surface border border-border rounded-lg p-4 mb-6">
                        <Text className="text-xs text-muted mb-1">SUBSCRIPTION SUMMARY</Text>
                        <Text className="text-foreground font-semibold">
                            {occurrences} {frequency} deliveries
                        </Text>
                        <Text className="text-xs text-muted mt-1">
                            From {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 bg-surface border border-border rounded-lg py-3 active:opacity-80"
                        >
                            <Text className="text-center text-foreground font-semibold">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            className="flex-1 bg-primary rounded-lg py-3 active:opacity-80"
                        >
                            <Text className="text-center text-white font-semibold">Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}
