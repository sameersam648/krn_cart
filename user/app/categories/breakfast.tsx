import { ScreenContainer } from '@/components/screen-container';
import { HotelList } from '@/components/hotel-list';
import { categoryHotels } from '@/lib/food-categories-data';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function BreakfastScreen() {
    const router = useRouter();
    const hotels = categoryHotels.breakfast;

    return (
        <ScreenContainer className="bg-background">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 border-b border-border">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Text className="text-2xl">←</Text>
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl font-bold text-foreground">🌅 Breakfast</Text>
                    <Text className="text-xs text-muted">Choose your breakfast hotel</Text>
                </View>
            </View>

            {/* Hotel List */}
            <HotelList hotels={hotels} />
        </ScreenContainer>
    );
}
