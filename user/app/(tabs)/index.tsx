import { FlatList, Image, Text, TouchableOpacity, View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { mockRestaurants } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { SearchBar } from "@/components/search-bar";
import { OrderTypeSelector } from "@/components/order-type-selector";
import { ScheduledOrderModal } from "@/components/scheduled-order-modal";
import { SubscriptionModal } from "@/components/subscription-modal";
import { CustomOrderModal } from "@/components/custom-order-modal";
import { FoodCategoryGrid } from "@/components/food-category-grid";
import { useState } from "react";
import { OrderType } from "@/lib/mock-data";

export default function HomeScreen() {
  const router = useRouter();
  const { items, orderType, setOrderType, setScheduledDateTime, setSubscriptionData, setCustomOrderData } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [showScheduledModal, setShowScheduledModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const cartCount = items.length;

  // Filter restaurants based on search query
  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.description.toLowerCase().includes(query)
    );
  });

  const handleRestaurantPress = (restaurantId: string) => {
    router.push({
      pathname: "/restaurant/[id]",
      params: { id: restaurantId },
    });
  };

  const handleCartPress = () => {
    router.push("/(tabs)/cart");
  };

  const handleOrderTypeChange = (type: OrderType) => {
    if (type === orderType) return;

    // Only show modal for custom orders
    // Scheduled and regular modals will appear during checkout
    if (type === 'custom') {
      setShowCustomModal(true);
    } else {
      // Quick, scheduled, or regular - just set the type
      setOrderType(type);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-4 border-b border-border">
        <View>
          <Text className="text-2xl font-bold text-foreground">Foodie</Text>
          <Text className="text-xs text-muted">Order now, eat soon</Text>
        </View>
        {cartCount > 0 && (
          <TouchableOpacity
            onPress={handleCartPress}
            className="relative"
          >
            <View className="bg-primary rounded-full w-8 h-8 items-center justify-center">
              <Text className="text-white font-bold text-sm">{cartCount}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Order Type Selector */}
      <OrderTypeSelector selectedType={orderType} onSelectType={handleOrderTypeChange} />

      {/* Food Category Grid */}
      <FoodCategoryGrid />

      {/* Restaurant List */}
      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="text-muted text-base">No restaurants found</Text>
            <Text className="text-muted text-sm mt-1">Try a different search term</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleRestaurantPress(item.id)}
            className="mx-4 mb-4 rounded-lg overflow-hidden bg-surface border border-border active:opacity-80"
          >
            {/* Restaurant Image */}
            <Image
              source={{ uri: item.image }}
              className="w-full h-40"
            />

            {/* Restaurant Info */}
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

      {/* Modals */}
      <ScheduledOrderModal
        isVisible={showScheduledModal}
        onClose={() => setShowScheduledModal(false)}
        onConfirm={(dateTime) => {
          setScheduledDateTime(dateTime);
          setOrderType('scheduled');
        }}
      />

      <SubscriptionModal
        isVisible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onConfirm={(data) => {
          setSubscriptionData(data);
          setOrderType('regular');
        }}
      />

      <CustomOrderModal
        isVisible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onConfirm={(data) => {
          setCustomOrderData(data);
          setOrderType('custom');
        }}
      />
    </ScreenContainer>
  );
}
