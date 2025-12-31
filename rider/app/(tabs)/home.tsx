import React, { useEffect } from "react";
import { FlatList, Text, View, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useOrders } from "@/lib/order-context";
import { useAuth } from "@/lib/auth-context";

export default function HomeScreen() {
  const router = useRouter();
  const { availableOrders, activeOrder, acceptOrder, rejectOrder, addMockOrders } = useOrders();
  const { rider, isSignedIn, isLoading } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.replace("/login");
    }
  }, [isSignedIn, isLoading]);

  const handleAccept = (orderId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    acceptOrder(orderId);
    router.push({ pathname: "/delivery", params: { orderId } });
  };

  const handleReject = (orderId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    rejectOrder(orderId);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addMockOrders();
    setRefreshing(false);
  };

  const renderOrderCard = ({ item }: { item: any }) => (
    <View className="bg-surface border border-border rounded-lg p-4 mb-3">
      {/* Order ID and Distance */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-xs text-muted font-semibold uppercase">Order ID</Text>
          <Text className="text-sm font-semibold text-foreground">{item.id}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted font-semibold">Distance</Text>
          <Text className="text-sm font-semibold text-primary">{item.estimatedDistance} km</Text>
        </View>
      </View>

      {/* Restaurant Info */}
      <View className="mb-3 pb-3 border-b border-border">
        <Text className="text-xs text-muted font-semibold uppercase">Pickup</Text>
        <Text className="text-sm font-semibold text-foreground">{item.restaurantName}</Text>
        <Text className="text-xs text-muted mt-1">{item.restaurantAddress}</Text>
      </View>

      {/* Delivery Info */}
      <View className="mb-3 pb-3 border-b border-border">
        <Text className="text-xs text-muted font-semibold uppercase">Delivery</Text>
        <Text className="text-sm font-semibold text-foreground">{item.customerName}</Text>
        <Text className="text-xs text-muted mt-1">{item.deliveryAddress}</Text>
      </View>

      {/* Earnings and Items */}
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-xs text-muted font-semibold">Estimated Earnings</Text>
          <Text className="text-lg font-bold text-success">${item.estimatedEarnings.toFixed(2)}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted font-semibold">Items</Text>
          <Text className="text-sm font-semibold text-foreground">{item.items.length}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => handleReject(item.id)}
          activeOpacity={0.7}
          className="flex-1 border border-border rounded-lg py-3 items-center"
        >
          <Text className="text-sm font-semibold text-foreground">Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAccept(item.id)}
          activeOpacity={0.7}
          className="flex-1 bg-primary rounded-lg py-3 items-center"
        >
          <Text className="text-sm font-semibold text-white">Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Loading...</Text>
      </ScreenContainer>
    );
  }

  if (!isSignedIn) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Please log in</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-foreground">Available Orders</Text>
        <Text className="text-sm text-muted mt-1">
          {availableOrders.length} order{availableOrders.length !== 1 ? "s" : ""} available
        </Text>
      </View>

      {/* Orders List */}
      {availableOrders.length > 0 ? (
        <FlatList
          data={availableOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-semibold text-muted mb-4">No orders available</Text>
          <TouchableOpacity
            onPress={handleRefresh}
            activeOpacity={0.7}
            className="bg-primary rounded-lg px-6 py-3"
          >
            <Text className="text-white font-semibold">Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenContainer>
  );
}
