import React, { useEffect } from "react";
import { FlatList, Text, View, RefreshControl, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useOrders } from "@/lib/order-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@/lib/constants";

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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    addMockOrders();
    setRefreshing(false);
  };

  const renderOrderCard = ({ item }: { item: any }) => (
    <Card className="mb-4">
      {/* Order ID and Distance */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mr-3">
            <Ionicons name="receipt" size={24} color="#FF6B35" />
          </View>
          <View>
            <Text className="text-xs text-muted font-bold uppercase tracking-wide">Order ID</Text>
            <Text className="text-base font-extrabold text-foreground">{item.id}</Text>
          </View>
        </View>
        <View className="bg-primary/10 px-3 py-2 rounded-xl">
          <Text className="text-xs text-muted font-bold">Distance</Text>
          <Text className="text-lg font-extrabold text-primary">{item.estimatedDistance} km</Text>
        </View>
      </View>

      {/* Restaurant Info */}
      <View className="mb-3 pb-3 border-b border-border/50">
        <View className="flex-row items-center mb-1">
          <Ionicons name="restaurant-outline" size={16} color="#64748B" />
          <Text className="text-xs text-muted font-bold uppercase ml-1">Pickup</Text>
        </View>
        <Text className="text-base font-bold text-foreground">{item.restaurantName}</Text>
        <Text className="text-sm text-muted mt-0.5">{item.restaurantAddress}</Text>
      </View>

      {/* Delivery Info */}
      <View className="mb-4 pb-3 border-b border-border/50">
        <View className="flex-row items-center mb-1">
          <Ionicons name="location-outline" size={16} color="#64748B" />
          <Text className="text-xs text-muted font-bold uppercase ml-1">Delivery</Text>
        </View>
        <Text className="text-base font-bold text-foreground">{item.customerName}</Text>
        <Text className="text-sm text-muted mt-0.5">{item.deliveryAddress}</Text>
      </View>

      {/* Earnings and Items */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1 bg-success/10 rounded-xl p-3 mr-2">
          <Text className="text-xs text-muted font-bold uppercase">Earnings</Text>
          <Text className="text-2xl font-extrabold text-success mt-1">{formatCurrency(item.estimatedEarnings)}</Text>
        </View>
        <View className="flex-1 bg-muted/10 rounded-xl p-3">
          <Text className="text-xs text-muted font-bold uppercase">Items</Text>
          <Text className="text-2xl font-extrabold text-foreground mt-1">{item.items.length}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <Button
          label="Reject"
          variant="outline"
          size="lg"
          onPress={() => handleReject(item.id)}
          className="flex-1"
          icon={<Ionicons name="close-circle-outline" size={20} color="#FF6B35" />}
        />
        <Button
          label="Accept"
          variant="primary"
          size="lg"
          onPress={() => handleAccept(item.id)}
          className="flex-1"
          icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
        />
      </View>
    </Card>
  );

  if (isLoading) {
    return (
      <ScreenContainer className="justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text className="text-muted mt-4">Loading...</Text>
      </ScreenContainer>
    );
  }

  if (!isSignedIn) {
    return (
      <ScreenContainer className="justify-center items-center bg-background">
        <Text className="text-foreground">Please log in</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0 bg-background">
      {/* Header */}
      <View className="px-5 pt-6 pb-4 bg-surface border-b border-border/40">
        <Text className="text-3xl font-extrabold text-foreground mb-1">Available Orders</Text>
        <View className="flex-row items-center">
          <View className="bg-primary/10 px-3 py-1.5 rounded-lg">
            <Text className="text-base font-extrabold text-primary">
              {availableOrders.length} {availableOrders.length === 1 ? "Order" : "Orders"}
            </Text>
          </View>
        </View>
      </View>

      {/* Orders List */}
      {availableOrders.length > 0 ? (
        <FlatList
          data={availableOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#FF6B35"
            />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-8">
          <View className="bg-muted/10 p-8 rounded-full mb-6">
            <Ionicons name="bicycle-outline" size={80} color="#94A3B8" />
          </View>
          <Text className="text-2xl font-extrabold text-foreground mb-2">No Orders Available</Text>
          <Text className="text-base text-muted text-center mb-8">
            Pull down to refresh or wait for new orders
          </Text>
          <Button
            label="Refresh"
            variant="primary"
            size="lg"
            onPress={handleRefresh}
            icon={<Ionicons name="refresh" size={20} color="white" />}
          />
        </View>
      )}
    </ScreenContainer>
  );
}
