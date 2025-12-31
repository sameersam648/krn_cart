import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import Modal from "react-native-modal";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface ScheduledOrderModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (dateTime: Date) => void;
}

export function ScheduledOrderModal({ isVisible, onClose, onConfirm }: ScheduledOrderModalProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
        }
    };

    const handleTimeChange = (event: DateTimePickerEvent, time?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (time) {
            setSelectedTime(time);
        }
    };

    const handleConfirm = () => {
        // Combine date and time
        const combinedDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            selectedTime.getHours(),
            selectedTime.getMinutes()
        );

        // Validate that the selected time is in the future
        if (combinedDateTime <= new Date()) {
            alert("Please select a future date and time");
            return;
        }

        onConfirm(combinedDateTime);
        onClose();
    };

    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose} className="m-0 justify-end">
            <View className="bg-background rounded-t-3xl p-6 pb-8">
                <Text className="text-2xl font-bold text-foreground mb-4">Schedule Order</Text>
                <Text className="text-sm text-muted mb-6">Select when you want your order delivered</Text>

                {/* Date Selection */}
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-foreground mb-2">Date</Text>
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        className="bg-surface border border-border rounded-lg p-4"
                    >
                        <Text className="text-foreground">{selectedDate.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                </View>

                {/* Time Selection */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-foreground mb-2">Time</Text>
                    <TouchableOpacity
                        onPress={() => setShowTimePicker(true)}
                        className="bg-surface border border-border rounded-lg p-4"
                    >
                        <Text className="text-foreground">
                            {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            value={selectedTime}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
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
            </View>
        </Modal>
    );
}
