import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { foodCategories } from '@/lib/food-categories-data';

export function FoodCategoryGrid() {
    const router = useRouter();

    const handleCategoryPress = (route: string) => {
        router.push(route as any);
    };

    return (
        <View className="px-4 py-4 bg-background">
            <Text className="text-xl font-bold text-foreground mb-3">Food Categories</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
            >
                {foodCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        onPress={() => handleCategoryPress(category.route)}
                        className="items-center justify-center bg-surface border border-border rounded-xl w-24 h-24 active:opacity-70"
                    >
                        <Text className="text-4xl mb-1">{category.icon}</Text>
                        <Text className="text-xs font-semibold text-foreground text-center px-1">
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
