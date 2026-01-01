import { FlatList, Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
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
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";

const PROMO_BANNERS = [
  { id: '1', title: '50% OFF', subtitle: 'On your first order', color: 'bg-primary', icon: 'fast-food' },
  { id: '2', title: 'Free Delivery', subtitle: 'Orders over $20', color: 'bg-blue-500', icon: 'bicycle' },
  { id: '3', title: 'Cashback', subtitle: 'Get $5 back', color: 'bg-emerald-500', icon: 'cash' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { items, orderType, setOrderType, setScheduledDateTime, setSubscriptionData, setCustomOrderData } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [showScheduledModal, setShowScheduledModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const cartCount = items.length;

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

  const handleOrderTypeChange = (type: OrderType) => {
    if (type === orderType) return;
    if (type === 'custom') {
      setShowCustomModal(true);
    } else {
      setOrderType(type);
    }
  };

  return (
    <ScreenContainer className="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="px-5 py-4 flex-row justify-between items-center bg-surface border-b border-border/40">
        <View className="flex-row items-center space-x-2.5">
          <View className="bg-primary/10 p-2.5 rounded-full">
            <Ionicons name="location" size={22} color="#FF6B35" />
          </View>
          <View>
            <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">Deliver to</Text>
            <View className="flex-row items-center">
              <Text className="text-sm font-bold text-foreground">Home • 123 Main St</Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" className="ml-1" />
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push("/(tabs)/cart")} className="relative bg-surface p-2.5 rounded-full border border-border/50 active:bg-muted/10">
          <Ionicons name="bag-handle-outline" size={24} color={cartCount > 0 ? "#FF6B35" : "#0F172A"} />
          {cartCount > 0 && (
            <View className="absolute top-0 right-0 bg-primary rounded-full w-[16px] h-[16px] items-center justify-center border border-white">
              <Text className="text-white font-bold text-[9px]">{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="pb-2">
            {/* Search Container */}
            <View className="px-4 pt-4 pb-2 bg-background z-10">
              <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            {/* Banners */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4 py-3" contentContainerStyle={{ paddingRight: 16 }}>
              {PROMO_BANNERS.map((banner) => (
                <View key={banner.id} className={`${banner.color} w-72 h-36 rounded-2xl mr-4 p-5 justify-between shadow-lg shadow-black/10 overflow-hidden relative`}>
                  {/* Decorative Circle */}
                  <View className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />

                  <View>
                    <View className="flex-row items-center mb-2 space-x-2">
                      <View className="bg-white/20 p-1.5 rounded-lg self-start">
                        <Ionicons name={banner.icon as any} size={16} color="white" />
                      </View>
                      <Text className="text-white/90 font-bold text-xs uppercase tracking-wide">Promo</Text>
                    </View>
                    <Text className="text-white font-extrabold text-2xl leading-7">{banner.title}</Text>
                    <Text className="text-white/90 font-medium mt-1">{banner.subtitle}</Text>
                  </View>

                  <TouchableOpacity className="bg-white self-start px-4 py-1.5 rounded-full active:opacity-90">
                    <Text className="text-primary font-bold text-xs">Claim Offer</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {/* Order Type Selector */}
            <View className="px-4 mb-4">
              <Text className="text-lg font-bold text-foreground mb-3 px-1">What would you like?</Text>
              <OrderTypeSelector selectedType={orderType} onSelectType={handleOrderTypeChange} />
            </View>

            {/* Categories */}
            <View className="mb-4">
              <FoodCategoryGrid />
            </View>

            <View className="px-5 mb-3 flex-row justify-between items-end">
              <Text className="text-xl font-bold text-foreground">Nearby Restaurants</Text>
              <TouchableOpacity>
                <Text className="text-sm font-medium text-primary">See All</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-16 opacity-70">
            <Ionicons name="restaurant-outline" size={48} color="#94A3B8" className="mb-2" />
            <Text className="text-muted text-base font-medium">No restaurants found</Text>
            <Text className="text-muted text-sm mt-1">Try searching for something else</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleRestaurantPress(item.id)}
            className="px-4 mb-6 active:scale-[0.99] transition-all"
          >
            <Card className="p-0 overflow-hidden border-0 shadow-sm bg-surface rounded-2xl">
              {/* Image Container */}
              <View className="relative">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-52 bg-muted/20"
                  resizeMode="cover"
                />

                {/* Top Left Badge - Only show if top rated */}
                {item.rating > 4.4 && (
                  <View className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                    <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">Top Rated</Text>
                  </View>
                )}

                {/* Bottom Right - Rating */}
                <View className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex-row items-center">
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text className="text-sm font-bold text-foreground ml-1">{item.rating}</Text>
                </View>
              </View>

              {/* Content */}
              <View className="p-4 pt-3">
                <Text className="text-lg font-extrabold text-foreground mb-1">{item.name}</Text>
                <Text className="text-sm text-muted font-medium mb-3" numberOfLines={2}>{item.description}</Text>

                <View className="flex-row items-center gap-2 border-t border-border/30 pt-3">
                  <View className="bg-success/10 px-2.5 py-1.5 rounded-lg flex-row items-center">
                    <Ionicons name="bicycle" size={14} color="#10B981" />
                    <Text className="text-xs font-bold text-success ml-1">Free</Text>
                  </View>
                  <View className="bg-muted/10 px-2.5 py-1.5 rounded-lg flex-row items-center">
                    <Ionicons name="time-outline" size={14} color="#64748B" />
                    <Text className="text-xs font-semibold text-muted ml-1">{item.deliveryTime}</Text>
                  </View>
                  <View className="bg-primary/10 px-2.5 py-1.5 rounded-lg flex-row items-center">
                    <Ionicons name="wallet-outline" size={14} color="#FF6B35" />
                    <Text className="text-xs font-semibold text-primary ml-1">Min $10</Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        )}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
