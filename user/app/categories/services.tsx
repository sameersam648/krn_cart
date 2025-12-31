import { ScreenContainer } from '@/components/screen-container';
import { serviceItems } from '@/lib/food-categories-data';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function ServicesScreen() {
    const router = useRouter();
    const [showMeatsSubmenu, setShowMeatsSubmenu] = useState(false);

    const handleServicePress = (service: typeof serviceItems[0]) => {
        if (service.hasSubmenu) {
            setShowMeatsSubmenu(!showMeatsSubmenu);
        } else {
            // Navigate to service detail or handle service selection
            console.log('Selected service:', service.name);
        }
    };

    return (
        <ScreenContainer className="bg-background">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 border-b border-border">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Text className="text-2xl">←</Text>
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl font-bold text-foreground">🛎️ Services</Text>
                    <Text className="text-xs text-muted">Delivery services</Text>
                </View>
            </View>

            {/* Service Items */}
            <FlatList
                data={serviceItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="mx-4 mb-4">
                        <TouchableOpacity
                            onPress={() => handleServicePress(item)}
                            className="rounded-lg overflow-hidden bg-surface border border-border active:opacity-80"
                        >
                            {/* Service Image */}
                            <Image
                                source={{ uri: item.image }}
                                className="w-full h-32"
                            />

                            {/* Service Info */}
                            <View className="p-3">
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-foreground mb-1">{item.name}</Text>
                                        <Text className="text-sm text-muted">{item.description}</Text>
                                    </View>
                                    {item.hasSubmenu && (
                                        <Text className="text-xl ml-2">{showMeatsSubmenu ? '▼' : '▶'}</Text>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Meats Submenu */}
                        {item.hasSubmenu && showMeatsSubmenu && item.submenuItems && (
                            <View className="mt-2 ml-4 bg-surface border border-border rounded-lg overflow-hidden">
                                {item.submenuItems.map((submenu) => (
                                    <TouchableOpacity
                                        key={submenu.id}
                                        className="flex-row items-center px-4 py-3 border-b border-border active:bg-muted/20"
                                        onPress={() => console.log('Selected meat:', submenu.name)}
                                    >
                                        <Text className="text-base text-foreground mr-2">🍖</Text>
                                        <Text className="text-base font-semibold text-foreground">{submenu.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                )}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 8 }}
            />
        </ScreenContainer>
    );
}
