import { FlatList, Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { mockRestaurants } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function RestaurantMenuScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const restaurant = mockRestaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <ScreenContainer className="bg-background items-center justify-center">
        <Text className="text-foreground">Restaurant not found</Text>
      </ScreenContainer>
    );
  }

  const handleAddToCart = (itemId: string) => {
    const menuItem = restaurant.items.find((item) => item.id === itemId);
    if (menuItem) {
      addItem(restaurant.id, menuItem, quantity);
      Alert.alert("Success", `${menuItem.name} added to cart!`);
      setQuantity(1);
      setSelectedItem(null);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="border-b border-border">
        <Image source={{ uri: restaurant.image }} className="w-full h-48" />
        <View className="p-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-2">
            <Text className="text-primary font-semibold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground mb-1">{restaurant.name}</Text>
          <Text className="text-sm text-muted">{restaurant.description}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <FlatList
        data={restaurant.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedItem(item.id)}
            className="mx-4 mb-3 rounded-lg overflow-hidden bg-surface border border-border active:opacity-80"
          >
            <View className="flex-row">
              {/* Item Image */}
              <Image source={{ uri: item.image }} className="w-24 h-24" />

              {/* Item Info */}
              <View className="flex-1 p-3 justify-between">
                <View>
                  <Text className="text-sm font-bold text-foreground">{item.name}</Text>
                  <Text className="text-xs text-muted mt-1">{item.description}</Text>
                </View>
                <Text className="text-base font-bold text-primary">₹{item.price}</Text>
              </View>
            </View>

            {/* Quantity Selector (shown when selected) */}
            {selectedItem === item.id && (
              <View className="bg-primary p-3 flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-white rounded px-2 py-1"
                  >
                    <Text className="text-primary font-bold">−</Text>
                  </TouchableOpacity>
                  <Text className="text-white font-bold w-6 text-center">{quantity}</Text>
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.min(10, quantity + 1))}
                    className="bg-white rounded px-2 py-1"
                  >
                    <Text className="text-primary font-bold">+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => handleAddToCart(item.id)}
                  className="bg-white px-4 py-2 rounded active:opacity-80"
                >
                  <Text className="text-primary font-bold text-sm">Add to Cart</Text>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </ScreenContainer>
  );
}
