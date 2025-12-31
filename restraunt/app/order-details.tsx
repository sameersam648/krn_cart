import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { StatusBadge } from '@/components/status-badge';
import { useOrders } from '@/lib/order-context';
import { formatCurrency, getElapsedTime, getNextStatuses, getStatusLabel } from '@/lib/order-utils';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { getOrderById, updateOrderStatus } = useOrders();
  const [isUpdating, setIsUpdating] = useState(false);

  const order = getOrderById(orderId as string);

  if (!order) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-lg text-foreground">Order not found</Text>
      </ScreenContainer>
    );
  }

  const nextStatuses = getNextStatuses(order.status);
  const elapsedTime = getElapsedTime(order.createdAt);

  const handleStatusUpdate = async (newStatus: typeof order.status) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      Alert.alert('Success', `Order status updated to ${getStatusLabel(newStatus)}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectOrder = () => {
    Alert.alert(
      'Reject Order',
      'Are you sure you want to reject this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => handleStatusUpdate('rejected'),
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="gap-6">
          {/* Order Header */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="text-2xl font-bold text-foreground">
                  Order #{order.id.replace('order_', '')}
                </Text>
                <Text className="text-sm text-muted mt-1">{elapsedTime}</Text>
              </View>
              <StatusBadge status={order.status} size="large" />
            </View>
          </View>

          {/* Customer Info */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Customer</Text>
            <View className="gap-2">
              <View>
                <Text className="text-xs text-muted">Name</Text>
                <Text className="text-base text-foreground font-semibold">{order.customerName}</Text>
              </View>
              {order.customerPhone && (
                <View>
                  <Text className="text-xs text-muted">Phone</Text>
                  <Text className="text-base text-foreground">{order.customerPhone}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Items */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Items</Text>
            <View className="gap-3">
              {order.items.map((item) => (
                <View key={item.id} className="flex-row justify-between items-center pb-3 border-b border-border last:border-b-0">
                  <View className="flex-1">
                    <Text className="text-base text-foreground font-semibold">{item.name}</Text>
                    {item.specialInstructions && (
                      <Text className="text-xs text-muted mt-1">Note: {item.specialInstructions}</Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className="text-sm text-muted">x{item.quantity}</Text>
                    {item.price && (
                      <Text className="text-sm text-foreground font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Special Instructions */}
          {order.specialInstructions && (
            <View className="bg-warning/10 border border-warning rounded-lg p-4 gap-2">
              <Text className="text-sm font-semibold text-warning">Special Instructions</Text>
              <Text className="text-sm text-foreground">{order.specialInstructions}</Text>
            </View>
          )}

          {/* Total */}
          <View className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-foreground">Total Amount</Text>
            <Text className="text-2xl font-bold text-primary">
              {formatCurrency(order.totalAmount)}
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            {order.status === 'new' && (
              <>
                <TouchableOpacity
                  onPress={() => handleStatusUpdate('accepted')}
                  disabled={isUpdating}
                  style={{ opacity: isUpdating ? 0.6 : 1 }}
                  className="bg-primary rounded-lg py-4 items-center"
                >
                  <Text className="text-white font-semibold text-base">Accept Order</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRejectOrder}
                  disabled={isUpdating}
                  style={{ opacity: isUpdating ? 0.6 : 1 }}
                  className="bg-error rounded-lg py-4 items-center"
                >
                  <Text className="text-white font-semibold text-base">Reject Order</Text>
                </TouchableOpacity>
              </>
            )}

            {order.status === 'accepted' && (
              <TouchableOpacity
                onPress={() => handleStatusUpdate('preparing')}
                disabled={isUpdating}
                style={{ opacity: isUpdating ? 0.6 : 1 }}
                className="bg-primary rounded-lg py-4 items-center"
              >
                <Text className="text-white font-semibold text-base">Start Preparing</Text>
              </TouchableOpacity>
            )}

            {order.status === 'preparing' && (
              <TouchableOpacity
                onPress={() => handleStatusUpdate('ready')}
                disabled={isUpdating}
                style={{ opacity: isUpdating ? 0.6 : 1 }}
                className="bg-success rounded-lg py-4 items-center"
              >
                <Text className="text-white font-semibold text-base">Mark Ready for Pickup</Text>
              </TouchableOpacity>
            )}

            {order.status === 'ready' && (
              <TouchableOpacity
                onPress={() => handleStatusUpdate('completed')}
                disabled={isUpdating}
                style={{ opacity: isUpdating ? 0.6 : 1 }}
                className="bg-success rounded-lg py-4 items-center"
              >
                <Text className="text-white font-semibold text-base">Complete Order</Text>
              </TouchableOpacity>
            )}

            {(order.status === 'completed' || order.status === 'rejected') && (
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-surface border border-border rounded-lg py-4 items-center"
              >
                <Text className="text-foreground font-semibold text-base">Back to Dashboard</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
