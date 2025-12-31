import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, Alert, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useOrders, type OrderStatus } from "@/lib/order-context";

const STATUS_STEPS: OrderStatus[] = ["accepted", "reached_restaurant", "picked_up", "on_the_way", "delivered"];

const STATUS_LABELS: Record<OrderStatus, string> = {
  accepted: "Accepted",
  reached_restaurant: "Reached Restaurant",
  picked_up: "Picked Up",
  on_the_way: "On the Way",
  delivered: "Delivered",
  pending: "Pending",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  accepted: "bg-blue-500",
  reached_restaurant: "bg-orange-500",
  picked_up: "bg-purple-500",
  on_the_way: "bg-indigo-500",
  delivered: "bg-green-500",
  pending: "bg-gray-500",
  cancelled: "bg-red-500",
};

export default function DeliveryScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { activeOrder, updateOrderStatus } = useOrders();
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  useEffect(() => {
    if (!activeOrder || activeOrder.id !== orderId) {
      router.back();
    } else {
      const currentIndex = STATUS_STEPS.indexOf(activeOrder.status as OrderStatus);
      setCurrentStatusIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [activeOrder, orderId]);

  if (!activeOrder || activeOrder.id !== orderId) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-foreground">Order not found</Text>
      </ScreenContainer>
    );
  }

  const handleStatusUpdate = async () => {
    if (currentStatusIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentStatusIndex + 1];
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      updateOrderStatus(activeOrder.id, nextStatus);
      setCurrentStatusIndex(currentStatusIndex + 1);

      if (nextStatus === "delivered") {
        Alert.alert("Success", "Order delivered successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]);
      }
    }
  };

  const handleOpenMaps = (lat: number, lng: number, label: string) => {
    const url = `https://maps.google.com/?q=${lat},${lng}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open maps");
    });
  };

  const handleCancel = () => {
    Alert.alert("Cancel Delivery", "Are you sure you want to cancel this delivery?", [
      { text: "No", onPress: () => {} },
      {
        text: "Yes, Cancel",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          updateOrderStatus(activeOrder.id, "cancelled");
          router.replace("/(tabs)/home");
        },
      },
    ]);
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="mb-6 pb-4 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} className="mb-3">
            <Text className="text-primary font-semibold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">Order {activeOrder.id}</Text>
          <Text className="text-sm text-muted mt-1">
            {new Date(activeOrder.createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Status Progress */}
        <View className="mb-6 p-4 bg-surface rounded-lg border border-border">
          <Text className="text-sm font-semibold text-muted uppercase mb-3">Current Status</Text>
          <View className="flex-row items-center gap-2 mb-3">
            <View className={`w-3 h-3 rounded-full ${STATUS_COLORS[activeOrder.status as OrderStatus]}`} />
            <Text className="text-lg font-bold text-foreground">{STATUS_LABELS[activeOrder.status as OrderStatus]}</Text>
          </View>

          {/* Status Steps */}
          <View className="gap-2">
            {STATUS_STEPS.map((status, index) => (
              <View key={status} className="flex-row items-center gap-3">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    index <= currentStatusIndex ? "bg-primary" : "bg-border"
                  }`}
                >
                  <Text className={`text-xs font-bold ${index <= currentStatusIndex ? "text-white" : "text-muted"}`}>
                    {index + 1}
                  </Text>
                </View>
                <Text className={`text-sm font-semibold ${index <= currentStatusIndex ? "text-foreground" : "text-muted"}`}>
                  {STATUS_LABELS[status]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Restaurant Info */}
        <View className="mb-4 p-4 bg-surface rounded-lg border border-border">
          <Text className="text-sm font-semibold text-muted uppercase mb-2">Pickup Location</Text>
          <Text className="text-base font-semibold text-foreground">{activeOrder.restaurantName}</Text>
          <Text className="text-sm text-muted mt-1">{activeOrder.restaurantAddress}</Text>
          <TouchableOpacity
            onPress={() =>
              handleOpenMaps(activeOrder.restaurantLat, activeOrder.restaurantLng, activeOrder.restaurantName)
            }
            className="mt-3 py-2 px-3 bg-primary rounded-lg items-center"
          >
            <Text className="text-white text-sm font-semibold">Open in Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Customer Info */}
        <View className="mb-4 p-4 bg-surface rounded-lg border border-border">
          <Text className="text-sm font-semibold text-muted uppercase mb-2">Delivery Location</Text>
          <Text className="text-base font-semibold text-foreground">{activeOrder.customerName}</Text>
          <Text className="text-sm text-muted mt-1">{activeOrder.customerPhone}</Text>
          <Text className="text-sm text-muted mt-2">{activeOrder.deliveryAddress}</Text>
          <TouchableOpacity
            onPress={() =>
              handleOpenMaps(activeOrder.deliveryLat, activeOrder.deliveryLng, activeOrder.customerName)
            }
            className="mt-3 py-2 px-3 bg-primary rounded-lg items-center"
          >
            <Text className="text-white text-sm font-semibold">Open in Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Order Items */}
        <View className="mb-4 p-4 bg-surface rounded-lg border border-border">
          <Text className="text-sm font-semibold text-muted uppercase mb-3">Order Items</Text>
          {activeOrder.items.map((item) => (
            <View key={item.id} className="flex-row justify-between items-center py-2 border-b border-border last:border-b-0">
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">{item.name}</Text>
                <Text className="text-xs text-muted">Qty: {item.quantity}</Text>
              </View>
              <Text className="text-sm font-semibold text-foreground">${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Special Instructions */}
        {activeOrder.specialInstructions && (
          <View className="mb-4 p-4 bg-warning/10 rounded-lg border border-warning">
            <Text className="text-sm font-semibold text-warning uppercase mb-1">Special Instructions</Text>
            <Text className="text-sm text-foreground">{activeOrder.specialInstructions}</Text>
          </View>
        )}

        {/* Distance and Earnings */}
        <View className="mb-6 flex-row gap-3">
          <View className="flex-1 p-4 bg-surface rounded-lg border border-border items-center">
            <Text className="text-xs text-muted font-semibold uppercase">Distance</Text>
            <Text className="text-2xl font-bold text-foreground mt-1">{activeOrder.estimatedDistance} km</Text>
          </View>
          <View className="flex-1 p-4 bg-surface rounded-lg border border-border items-center">
            <Text className="text-xs text-muted font-semibold uppercase">Earnings</Text>
            <Text className="text-2xl font-bold text-success mt-1">${activeOrder.estimatedEarnings.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-3">
          {activeOrder.status !== "delivered" && activeOrder.status !== "cancelled" && (
            <TouchableOpacity
              onPress={handleStatusUpdate}
              activeOpacity={0.7}
              className="bg-primary rounded-lg py-4 items-center"
            >
              <Text className="text-white font-semibold text-base">
                {currentStatusIndex < STATUS_STEPS.length - 1
                  ? `Mark as ${STATUS_LABELS[STATUS_STEPS[currentStatusIndex + 1]]}`
                  : "Complete Delivery"}
              </Text>
            </TouchableOpacity>
          )}

          {activeOrder.status !== "delivered" && activeOrder.status !== "cancelled" && (
            <TouchableOpacity
              onPress={handleCancel}
              activeOpacity={0.7}
              className="border border-error rounded-lg py-3 items-center"
            >
              <Text className="text-error font-semibold">Cancel Delivery</Text>
            </TouchableOpacity>
          )}

          {(activeOrder.status === "delivered" || activeOrder.status === "cancelled") && (
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)/home")}
              activeOpacity={0.7}
              className="bg-primary rounded-lg py-4 items-center"
            >
              <Text className="text-white font-semibold text-base">Back to Home</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
