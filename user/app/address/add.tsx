import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function AddAddressScreen() {
    const router = useRouter();
    const [label, setLabel] = useState('Home');
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert("Success", "Address added successfully", [
                { text: "OK", onPress: () => router.back() }
            ]);
        }, 1000);
    };

    const LabelOption = ({ title, icon }: { title: string, icon: any }) => (
        <TouchableOpacity
            onPress={() => setLabel(title)}
            className={`flex-1 flex-row items-center justify-center p-3 rounded-xl border mr-2 last:mr-0 ${label === title ? 'bg-primary border-primary' : 'bg-surface border-border'}`}
        >
            <Ionicons name={icon} size={18} color={label === title ? "white" : "#64748B"} />
            <Text className={`ml-2 font-semibold ${label === title ? "text-white" : "text-muted"}`}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScreenContainer className="bg-background">
            {/* Header */}
            <View className="px-5 py-4 flex-row items-center border-b border-border/40">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-foreground">Add Address</Text>
            </View>

            <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
                {/* Label Selection */}
                <Text className="text-sm font-bold text-foreground mb-3">Address Label</Text>
                <View className="flex-row mb-6">
                    <LabelOption title="Home" icon="home-outline" />
                    <LabelOption title="Work" icon="briefcase-outline" />
                    <LabelOption title="Other" icon="location-outline" />
                </View>

                {/* Form */}
                <View className="space-y-5">
                    <Input
                        label="Receiver Name"
                        placeholder="Ex. John Doe"
                        icon={<Ionicons name="person-outline" size={20} color="#94A3B8" />}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="Ex. +91 98765 43210"
                        keyboardType="phone-pad"
                        icon={<Ionicons name="call-outline" size={20} color="#94A3B8" />}
                    />

                    <View className="flex-row space-x-4">
                        <View className="flex-1">
                            <Input label="House / Flat No." placeholder="Ex. 4B" />
                        </View>
                        <View className="flex-1">
                            <Input label="Floor" placeholder="Ex. 4th Floor" />
                        </View>
                    </View>

                    <Input
                        label="Apartment / Building Name"
                        placeholder="Ex. Green Valley Apartments"
                        icon={<Ionicons name="business-outline" size={20} color="#94A3B8" />}
                    />

                    <Input
                        label="Street Name / Area"
                        placeholder="Ex. 123 Main Street, Downtown"
                        icon={<Ionicons name="map-outline" size={20} color="#94A3B8" />}
                    />

                    <Input
                        label="Landmark (Optional)"
                        placeholder="Ex. Near City Mall"
                        icon={<Ionicons name="flag-outline" size={20} color="#94A3B8" />}
                    />
                </View>

                <View className="mt-8">
                    <Button
                        label="Save Address"
                        onPress={handleSave}
                        loading={loading}
                        size="lg"
                    />
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
