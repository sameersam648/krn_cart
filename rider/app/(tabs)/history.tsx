import React, { useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useOrders } from "@/lib/order-context";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency, formatElapsedTime } from "@/lib/constants";
import type { OrderStatus } from "@/lib/order-context";

export default function HistoryScreen() {
  const { completedOrders = [] } = useOrders();

  // Filter and calculate with safe defaults
  const filteredOrders = useMemo(
    () => (completedOrders || []).filter(o => o?.status === 'delivered' || o?.status === 'cancelled'),
    [completedOrders]
  );

  // Calculate total earnings
  const totalEarnings = useMemo(
    () => filteredOrders
      .filter(o => o?.status === 'delivered')
      .reduce((sum, o) => sum + (o?.estimatedEarnings || 0), 0),
    [filteredOrders]
  );

  const renderOrderCard = ({ item }: { item: any }) => {
    const isDelivered = item.status === 'delivered';

    return (
      <Card className="mb-3">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-base font-extrabold text-foreground mb-1">
              Order {item.id}
            </Text>
            <Text className="text-xs text-muted">{formatElapsedTime(item.createdAt)}</Text>
          </View>
          <StatusBadge status={item.status as OrderStatus} size="medium" />
        </View>

        {/* Details */}
        <View className="flex-row justify-between items-center py-3 border-t border-border/30">
          <View className="flex-row items-center flex-1">
            <Ionicons name="location-outline" size={16} color="#64748B" />
            <Text className="text-sm text-muted ml-2">{item.estimatedDistance} km</Text>
          </View>
          <View className="flex-row items-center flex-1">
            <Ionicons name="bag-handle-outline" size={16} color="#64748B" />
            <Text className="text-sm text-muted ml-2">{item.items.length} items</Text>
          </View>
          <View className="flex-1 items-end">
            <Text className={`text-lg font-extrabold ${isDelivered ? 'text-success' : 'text-muted'}`}>
              {isDelivered ? formatCurrency(item.estimatedEarnings) : 'Cancelled'}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      {/* Header */}
      <View className="px-5 pt-6 pb-4 bg-surface border-b border-border/40">
        <Text className="text-3xl font-extrabold text-foreground mb-3">Delivery History</Text>

        {/* Earnings Summary */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-success/10 rounded-xl p-3 border border-success/30">
            <Text className="text-xs font-bold text-muted uppercase">Total Earnings</Text>
            <Text className="text-2xl font-extrabold text-success mt-1">{formatCurrency(totalEarnings)}</Text>
          </View>
          <View className="flex-1 bg-primary/10 rounded-xl p-3 border border-primary/30">
            <Text className="text-xs font-bold text-muted uppercase">Completed</Text>
            <Text className="text-2xl font-extrabold text-primary mt-1">
              {filteredOrders.filter(o => o?.status === 'delivered').length}
            </Text>
          </View>
        </View>
      </View>

      {/* Order List */}
      {filteredOrders.length > 0 ? (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        />
      ) : (
        <View className="flex-1 justify-center items-center p-8">
          <View className="bg-muted/10 p-8 rounded-full mb-6">
            <Ionicons name="file-tray-outline" size={80} color="#94A3B8" />
          </View>
          <Text className="text-2xl font-extrabold text-foreground mb-2">No History Yet</Text>
          <Text className="text-base text-muted text-center">
            Your completed deliveries will appear here
          </Text>
        </View>
      )}
    </ScreenContainer>
  );
}
