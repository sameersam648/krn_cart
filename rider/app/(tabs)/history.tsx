import React from "react";
import { FlatList, Text, View, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useOrders } from "@/lib/order-context";

export default function HistoryScreen() {
  const { completedOrders } = useOrders();

  const renderHistoryCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        Alert.alert(
          `Order ${item.id}`,
          `Restaurant: ${item.restaurantName}\nCustomer: ${item.customerName}\nStatus: ${item.status}\nEarnings: $${item.estimatedEarnings.toFixed(2)}`,
        )
      }
      activeOpacity={0.7}
      className="bg-surface border border-border rounded-lg p-4 mb-3"
    >
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-xs text-muted font-semibold uppercase">Order ID</Text>
          <Text className="text-sm font-semibold text-foreground">{item.id}</Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted font-semibold">Status</Text>
          <Text
            className={`text-xs font-semibold px-2 py-1 rounded ${
              item.status === "delivered" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {item.status === "delivered" ? "Delivered" : "Cancelled"}
          </Text>
        </View>
      </View>

      {/* Restaurant and Customer */}
      <View className="mb-3 pb-3 border-b border-border">
        <Text className="text-xs text-muted font-semibold uppercase">From</Text>
        <Text className="text-sm font-semibold text-foreground">{item.restaurantName}</Text>
      </View>

      <View className="mb-3 pb-3 border-b border-border">
        <Text className="text-xs text-muted font-semibold uppercase">To</Text>
        <Text className="text-sm font-semibold text-foreground">{item.customerName}</Text>
      </View>

      {/* Date and Earnings */}
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-muted font-semibold">Date</Text>
          <Text className="text-sm font-semibold text-foreground">
            {new Date(item.deliveredAt || item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted font-semibold">Earnings</Text>
          <Text className="text-lg font-bold text-success">${item.estimatedEarnings.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Calculate summary stats
  const totalEarnings = completedOrders.reduce((sum, order) => sum + order.estimatedEarnings, 0);
  const deliveredCount = completedOrders.filter((o) => o.status === "delivered").length;
  const cancelledCount = completedOrders.filter((o) => o.status === "cancelled").length;

  return (
    <ScreenContainer className="p-4">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-foreground">Delivery History</Text>
        <Text className="text-sm text-muted mt-1">
          {completedOrders.length} order{completedOrders.length !== 1 ? "s" : ""} completed
        </Text>
      </View>

      {/* Summary Stats */}
      {completedOrders.length > 0 && (
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 p-4 bg-surface rounded-lg border border-border items-center">
            <Text className="text-xs text-muted font-semibold uppercase">Delivered</Text>
            <Text className="text-2xl font-bold text-success mt-1">{deliveredCount}</Text>
          </View>
          <View className="flex-1 p-4 bg-surface rounded-lg border border-border items-center">
            <Text className="text-xs text-muted font-semibold uppercase">Cancelled</Text>
            <Text className="text-2xl font-bold text-error mt-1">{cancelledCount}</Text>
          </View>
          <View className="flex-1 p-4 bg-surface rounded-lg border border-border items-center">
            <Text className="text-xs text-muted font-semibold uppercase">Total Earnings</Text>
            <Text className="text-2xl font-bold text-primary mt-1">${totalEarnings.toFixed(2)}</Text>
          </View>
        </View>
      )}

      {/* History List */}
      {completedOrders.length > 0 ? (
        <FlatList
          data={completedOrders}
          renderItem={renderHistoryCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg font-semibold text-muted">No completed deliveries yet</Text>
          <Text className="text-sm text-muted mt-2">Start accepting orders to build your history</Text>
        </View>
      )}
    </ScreenContainer>
  );
}
