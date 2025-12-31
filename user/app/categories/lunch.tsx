import { ScreenContainer } from '@/components/screen-container';
import { SubcategorySelector } from '@/components/subcategory-selector';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LunchScreen() {
    const router = useRouter();

    return (
        <ScreenContainer className="bg-background">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 border-b border-border">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Text className="text-2xl">←</Text>
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl font-bold text-foreground">🍱 Lunch</Text>
                    <Text className="text-xs text-muted">Select your preference</Text>
                </View>
            </View>

            {/* Subcategory Selector */}
            <SubcategorySelector categoryPrefix="lunch" />
        </ScreenContainer>
    );
}
