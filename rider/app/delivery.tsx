import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, Alert, Linking } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "@/components/screen-container";
import { useOrders, type OrderStatus } from "@/lib/order-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Ionicons } from "@expo/vector-icons";
import { STATUS_STEPS, STATUS_LABELS, formatCurrency, generateMapsUrl } from "@/lib/constants";

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
      <ScreenContainer className="justify-center items-center bg-background">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-xl font-bold text-foreground mt-4">Order not found</Text>
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
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Success", "Order delivered successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/home"),
          },
        ]);
      }
    }
  };

  const handleOpenMaps = (lat: number, lng: number) => {
    const url = generateMapsUrl(lat, lng);
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open maps");
    });
  };

  const handleCancel = () => {
    Alert.alert("Cancel Delivery", "Are you sure you want to cancel this delivery?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          updateOrderStatus(activeOrder.id, "cancelled");
          router.replace("/(tabs)/home");
        },
      },
    ]);
  };

  const nextAction = currentStatusIndex < STATUS_STEPS.length - 1
    ? `Mark as ${STATUS_LABELS[STATUS_STEPS[currentStatusIndex + 1]]}`
    : "Complete Delivery";

  return (
    <ScreenContainer className="p-0 bg-background">
      {/* Header */}
      <View className="px-5 py-4 bg-surface border-b border-border/40">
        <Button
          label="Back"
          variant="ghost"
          size="md"
          onPress={() => router.back()}
          icon={<Ionicons name="arrow-back" size={20} color="#FF6B35" />}
          className="self-start -ml-2 mb-2"
        />
        <Text className="text-2xl font-extrabold text-foreground">Order {activeOrder.id}</Text>
        <Text className="text-sm text-muted mt-1">
          {new Date(activeOrder.createdAt).toLocaleString()}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Current Status - Large for Visibility */}
        <Card className="mb-4 bg-primary/5 border-2 border-primary/30">
          <View className="items-center py-2">
            <Text className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Current Status</Text>
            <StatusBadge status={activeOrder.status as OrderStatus} size="large" />
          </View>
        </Card>

        {/* Status Progress */}
        <Card className="mb-4">
          <Text className="text-sm font-bold text-muted uppercase mb-4">Delivery Progress</Text>
          <View className="gap-3">
            {STATUS_STEPS.map((status, index) => (
              <View key={status} className="flex-row items-center">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${index <= currentStatusIndex ? "bg-primary" : "bg-border"
                    }`}
                >
                  {index <= currentStatusIndex ? (
                    <Ionicons name="checkmark" size={20} color="white" />
                  ) : (
                    <Text className="text-sm font-bold text-muted">{index + 1}</Text>
                  )}
                </View>
                <Text className={`text-base font-bold ml-3 ${index <= currentStatusIndex ? "text-foreground" : "text-muted"}`}>
                  {STATUS_LABELS[status]}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Restaurant Info */}
        <Card className="mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
              <Ionicons name="restaurant" size={20} color="#FF6B35" />
            </View>
            <Text className="text-lg font-bold text-foreground">Pickup Location</Text>
          </View>
          <Text className="text-base font-bold text-foreground mb-1">{activeOrder.restaurantName}</Text>
          <Text className="text-sm text-muted mb-4">{activeOrder.restaurantAddress}</Text>
          <Button
            label="Open in Maps"
            variant="primary"
            size="lg"
            onPress={() => handleOpenMaps(activeOrder.restaurantLat, activeOrder.restaurantLng)}
            icon={<Ionicons name="navigate" size={20} color="white" />}
          />
        </Card>

        {/* Customer Info */}
        <Card className="mb-4">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 bg-success/10 rounded-full items-center justify-center mr-3">
              <Ionicons name="location" size={20} color="#10B981" />
            </View>
            <Text className="text-lg font-bold text-foreground">Delivery Location</Text>
          </View>
          <Text className="text-base font-bold text-foreground mb-1">{activeOrder.customerName}</Text>
          <Text className="text-sm text-muted mb-1">{activeOrder.customerPhone}</Text>
          <Text className="text-sm text-muted mb-4">{activeOrder.deliveryAddress}</Text>
          <Button
            label="Open in Maps"
            variant="success"
            size="lg"
            onPress={() => handleOpenMaps(activeOrder.deliveryLat, activeOrder.deliveryLng)}
            icon={<Ionicons name="navigate" size={20} color="white" />}
          />
        </Card>

        {/* Order Items */}
        <Card className="mb-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="bag-handle" size={20} color="#64748B" />
            <Text className="text-base font-bold text-foreground ml-2">Order Items ({activeOrder.items.length})</Text>
          </View>
          {activeOrder.items.map((item) => (
            <View key={item.id} className="flex-row justify-between py-2 border-b border-border/30 last:border-b-0">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{item.name}</Text>
                <Text className="text-sm text-muted">Qty: {item.quantity}</Text>
              </View>
              <Text className="text-base font-bold text-foreground">${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </Card>

        {/* Special Instructions */}
        {activeOrder.specialInstructions && (
          <Card className="mb-4 bg-warning/10 border-2 border-warning/30">
            <View className="flex-row items-center mb-2">
              <Ionicons name="alert-circle" size={20} color="#F59E0B" />
              <Text className="text-base font-bold text-warning ml-2">Special Instructions</Text>
            </View>
            <Text className="text-base text-foreground leading-6">{activeOrder.specialInstructions}</Text>
          </Card>
        )}

        {/* Distance and Earnings */}
        <View className="flex-row gap-3 mb-4">
          <Card className="flex-1 items-center">
            <Text className="text-xs text-muted font-bold uppercase mb-1">Distance</Text>
            <Text className="text-3xl font-extrabold text-foreground">{activeOrder.estimatedDistance}</Text>
            <Text className="text-sm text-muted">km</Text>
          </Card>
          <Card className="flex-1 items-center bg-success/10">
            <Text className="text-xs text-muted font-bold uppercase mb-1">Earnings</Text>
            <Text className="text-3xl font-extrabold text-success">{formatCurrency(activeOrder.estimatedEarnings)}</Text>
          </Card>
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border/80 p-5 pb-8 gap-3 shadow-lg">
        {activeOrder.status !== "delivered" && activeOrder.status !== "cancelled" && (
          <>
            <Button
              label={nextAction}
              variant="primary"
              size="xl"
              onPress={handleStatusUpdate}
              icon={<Ionicons name="checkmark-circle" size={24} color="white" />}
            />
            <Button
              label="Cancel Delivery"
              variant="danger"
              size="lg"
              onPress={handleCancel}
              icon={<Ionicons name="close-circle" size={20} color="white" />}
            />
          </>
        )}

        {(activeOrder.status === "delivered" || activeOrder.status === "cancelled") && (
          <Button
            label="Back to Home"
            variant="primary"
            size="xl"
            onPress={() => router.replace("/(tabs)/home")}
            icon={<Ionicons name="home" size={24} color="white" />}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
