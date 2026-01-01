import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const MOCKED_ADDRESSES = [
    {
        id: '1',
        label: 'Home',
        address: '123 Main Street, Apartment 4B',
        city: 'New York, NY 10001',
        isDefault: true,
        icon: 'home',
    },
    {
        id: '2',
        label: 'Work',
        address: '456 Business Blvd, Suite 200',
        city: 'New York, NY 10002',
        isDefault: false,
        icon: 'briefcase',
    },
    {
        id: '3',
        label: 'Parents',
        address: '789 Suburban Lane',
        city: 'White Plains, NY 10601',
        isDefault: false,
        icon: 'people',
    },
];

export default function AddressListScreen() {
    const router = useRouter();
    const [addresses, setAddresses] = useState(MOCKED_ADDRESSES);

    const handleDelete = (id: string) => {
        Alert.alert("Delete Address", "Are you sure you want to remove this address?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => setAddresses(prev => prev.filter(a => a.id !== id))
            }
        ]);
    };

    const handleSetDefault = (id: string) => {
        setAddresses(prev => prev.map(a => ({
            ...a,
            isDefault: a.id === id
        })));
    };

    return (
        <ScreenContainer className="bg-background">
            {/* Header */}
            <View className="px-5 py-4 flex-row items-center border-b border-border/40">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-foreground">My Addresses</Text>
            </View>

            {/* Address List */}
            <FlatList
                data={addresses}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <Card className={`mb-4 p-4 border ${item.isDefault ? 'border-primary bg-primary/5' : 'border-border/60 bg-surface'}`}>
                        <View className="flex-row items-start justify-between">
                            <View className="flex-row items-start flex-1 mr-4">
                                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${item.isDefault ? 'bg-primary' : 'bg-muted/10'}`}>
                                    <Ionicons name={item.icon as any} size={20} color={item.isDefault ? 'white' : '#64748B'} />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row items-center">
                                        <Text className="text-base font-bold text-foreground mr-2">{item.label}</Text>
                                        {item.isDefault && (
                                            <View className="bg-primary/20 px-2 py-0.5 rounded">
                                                <Text className="text-[10px] font-bold text-primary uppercase">Default</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="text-sm text-foreground mt-1">{item.address}</Text>
                                    <Text className="text-xs text-muted mt-0.5">{item.city}</Text>
                                </View>
                            </View>

                            <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2">
                                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>

                        {!item.isDefault && (
                            <TouchableOpacity
                                onPress={() => handleSetDefault(item.id)}
                                className="mt-3 pt-3 border-t border-border/30 flex-row items-center"
                            >
                                <Text className="text-primary text-sm font-semibold">Set as Default</Text>
                            </TouchableOpacity>
                        )}
                    </Card>
                )}
            />

            {/* Add Button */}
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-surface border-t border-border/50">
                <Button
                    label="Add New Address"
                    onPress={() => router.push('/address/add')}
                    size="lg"
                    icon={<Ionicons name="add" size={20} color="white" />}
                />
            </View>
        </ScreenContainer>
    );
}
