import { ScreenContainer } from '@/components/screen-container';
import { vegetableItems } from '@/lib/food-categories-data';
import { MenuItem } from '@/lib/mock-data';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/lib/cart-context';

export default function VegetablesScreen() {
    const router = useRouter();
    const { addItem } = useCart();

    const handleAddToCart = (item: typeof vegetableItems[0]) => {
        // Create a menu item from vegetable
        const menuItem: MenuItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.unit,
            image: item.image,
            category: 'Vegetables',
        };

        addItem('vegetables', menuItem, 1);
    };

    return (
        <ScreenContainer className="bg-background">
            {/* Header */}
            <View className="flex-row items-center px-4 py-4 border-b border-border">
                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                    <Text className="text-2xl">←</Text>
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl font-bold text-foreground">🥬 Vegetables</Text>
                    <Text className="text-xs text-muted">Fresh vegetables delivered</Text>
                </View>
            </View>

            {/* Vegetable Items Grid */}
            <FlatList
                data={vegetableItems}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
                renderItem={({ item }) => (
                    <View className="flex-1 bg-surface border border-border rounded-lg overflow-hidden mb-4">
                        {/* Item Image */}
                        <Image
                            source={{ uri: item.image }}
                            className="w-full h-32"
                        />

                        {/* Item Info */}
                        <View className="p-3">
                            <Text className="text-base font-bold text-foreground mb-1">{item.name}</Text>
                            <Text className="text-xs text-muted mb-2">{item.unit}</Text>

                            {/* Price and Add Button */}
                            <View className="flex-row justify-between items-center">
                                <Text className="text-primary font-bold text-base">₹{item.price}</Text>
                                <TouchableOpacity
                                    onPress={() => handleAddToCart(item)}
                                    className="bg-primary px-3 py-1.5 rounded-md active:opacity-70"
                                >
                                    <Text className="text-white text-xs font-semibold">Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12 }}
            />
        </ScreenContainer>
    );
}
