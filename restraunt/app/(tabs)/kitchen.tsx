import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useOrders } from '@/lib/order-context';
import { getElapsedTime, getStatusLabel, formatCurrency } from '@/lib/order-utils';
import { StatusBadge } from '@/components/status-badge';

export default function KitchenViewScreen() {
  const { orders, updateOrderStatus } = useOrders();
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter only active orders
  const activeOrders = orders.filter(order =>
    ['accepted', 'preparing', 'ready'].includes(order.status)
  );

  const handleStatusUpdate = async (orderId: string, newStatus: any) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextAction = (status: any) => {
    const actions: Record<string, { label: string; nextStatus: any; color: string }> = {
      accepted: { label: 'Start Preparing', nextStatus: 'preparing', color: '#FF6B35' },
      preparing: { label: 'Mark Ready', nextStatus: 'ready', color: '#22C55E' },
      ready: { label: 'Complete', nextStatus: 'completed', color: '#22C55E' },
    };
    return actions[status];
  };

  const renderKitchenCard = ({ item }: any) => {
    const action = getNextAction(item.status);
    const elapsedTime = getElapsedTime(item.createdAt);

    return (
      <View className="px-4 mb-4">
        <View className="bg-surface rounded-lg p-4 border-2 border-border">
          {/* Order ID - Large */}
          <Text className="text-5xl font-bold text-foreground mb-4">
            #{item.id.replace('order_', '')}
          </Text>

          {/* Status and Time */}
          <View className="flex-row justify-between items-center mb-4">
            <StatusBadge status={item.status} size="large" />
            <Text className="text-lg font-semibold text-primary">{elapsedTime}</Text>
          </View>

          {/* Items - Large Text */}
          <View className="mb-4 bg-primary/10 rounded-lg p-3">
            {item.items.map((itemObj: any) => (
              <View key={itemObj.id} className="mb-2">
                <Text className="text-2xl font-bold text-foreground">
                  {itemObj.quantity}x {itemObj.name}
                </Text>
                {itemObj.specialInstructions && (
                  <Text className="text-base text-warning mt-1">
                    ⚠️ {itemObj.specialInstructions}
                  </Text>
                )}
              </View>
            ))}
          </View>

          {/* Special Instructions */}
          {item.specialInstructions && (
            <View className="mb-4 bg-warning/10 rounded-lg p-3 border border-warning">
              <Text className="text-base font-semibold text-warning">Special Instructions</Text>
              <Text className="text-base text-foreground mt-1">{item.specialInstructions}</Text>
            </View>
          )}

          {/* Action Button */}
          {action && (
            <TouchableOpacity
              onPress={() => handleStatusUpdate(item.id, action.nextStatus)}
              disabled={isUpdating}
              style={{
                backgroundColor: action.color,
                opacity: isUpdating ? 0.6 : 1,
              }}
              className="rounded-lg py-4 items-center"
            >
              <Text className="text-white font-bold text-xl">{action.label}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">Kitchen</Text>
          <Text className="text-sm text-muted mt-1">
            {activeOrders.length} active order{activeOrders.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Kitchen Orders */}
        {activeOrders.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-2xl font-bold text-foreground">No Active Orders</Text>
            <Text className="text-base text-muted mt-2">All caught up! 🎉</Text>
          </View>
        ) : (
          <FlatList
            data={activeOrders}
            keyExtractor={item => item.id}
            renderItem={renderKitchenCard}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
