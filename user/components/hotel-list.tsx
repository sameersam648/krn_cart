import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Hotel } from '@/lib/food-categories-data';

interface HotelListProps {
    hotels: Hotel[];
    title?: string;
}

export function HotelList({ hotels, title }: HotelListProps) {
    const router = useRouter();

    const handleHotelPress = (hotelId: string) => {
        // Navigate to restaurant detail page
        router.push({
            pathname: '/restaurant/[id]',
            params: { id: hotelId },
        });
    };

    return (
        <View className="flex-1">
            {title && (
                <View className="px-4 py-2">
                    <Text className="text-lg font-bold text-foreground">{title}</Text>
                </View>
            )}
            <FlatList
                data={hotels}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleHotelPress(item.id)}
                        className="mx-4 mb-4 rounded-lg overflow-hidden bg-surface border border-border active:opacity-80"
                    >
                        {/* Hotel Image */}
                        <Image
                            source={{ uri: item.image }}
                            className="w-full h-32"
                        />

                        {/* Hotel Info */}
                        <View className="p-3">
                            <Text className="text-lg font-bold text-foreground mb-1">{item.name}</Text>
                            <Text className="text-sm text-muted mb-2">{item.description}</Text>

                            {/* Rating and Delivery Time */}
                            <View className="flex-row justify-between items-center">
                                <View className="flex-row items-center gap-1">
                                    <Text className="text-yellow-500 font-bold">★</Text>
                                    <Text className="text-sm font-semibold text-foreground">{item.rating}</Text>
                                </View>
                                <Text className="text-xs text-muted">{item.deliveryTime}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 8 }}
            />
        </View>
    );
}
