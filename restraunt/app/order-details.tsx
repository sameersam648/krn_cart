import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { StatusBadge } from '@/components/status-badge';
import { useOrders } from '@/lib/order-context';
import { formatCurrency, getElapsedTime, getNextStatuses, getStatusLabel } from '@/lib/order-utils';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();
  const { getOrderById, updateOrderStatus } = useOrders();
  const [isUpdating, setIsUpdating] = useState(false);

  const order = getOrderById(orderId as string);

  if (!order) {
    return (
      <ScreenContainer className="justify-center items-center bg-background">
        <View className="items-center p-8">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-xl font-bold text-foreground mt-4">Order not found</Text>
        </View>
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
    <ScreenContainer className="bg-background">
      {/* Header */}
      <View className="px-5 py-4 bg-surface border-b border-border/40 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">Order Details</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Order Header Card */}
        <Card className="mb-4 p-5 bg-surface border-border/50">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1">
              <Text className="text-3xl font-extrabold text-foreground">
                #{order.id.replace('order_', '')}
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="time-outline" size={16} color="#64748B" />
                <Text className="text-sm text-muted ml-1">{elapsedTime}</Text>
              </View>
            </View>
            <StatusBadge status={order.status} size="large" />
          </View>
        </Card>

        {/* Customer Info Card */}
        <Card className="mb-4 p-5 bg-surface border-border/50">
          <View className="flex-row items-center mb-3">
            <Ionicons name="person" size={20} color="#FF6B35" />
            <Text className="text-lg font-bold text-foreground ml-2">Customer</Text>
          </View>
          <View className="gap-3">
            <View>
              <Text className="text-xs font-semibold text-muted uppercase tracking-wider">Name</Text>
              <Text className="text-base font-bold text-foreground mt-1">{order.customerName}</Text>
            </View>
            {order.customerPhone && (
              <View>
                <Text className="text-xs font-semibold text-muted uppercase tracking-wider">Phone</Text>
                <Text className="text-base text-foreground mt-1">{order.customerPhone}</Text>
              </View>
            )}
          </View>
        </Card>

        {/* Items Card */}
        <Card className="mb-4 p-5 bg-surface border-border/50">
          <View className="flex-row items-center mb-4">
            <Ionicons name="restaurant" size={20} color="#FF6B35" />
            <Text className="text-lg font-bold text-foreground ml-2">Order Items</Text>
          </View>
          {order.items.map((item, index) => (
            <View
              key={item.id}
              className={`pb-3 ${index < order.items.length - 1 ? 'mb-3 border-b border-border/30' : ''}`}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-4">
                  <Text className="text-base font-bold text-foreground">{item.name}</Text>
                  {item.specialInstructions && (
                    <View className="bg-warning/10 border border-warning/30 rounded-lg p-2 mt-2">
                      <Text className="text-xs font-semibold text-warning uppercase">Note:</Text>
                      <Text className="text-sm text-foreground mt-1">{item.specialInstructions}</Text>
                    </View>
                  )}
                </View>
                <View className="items-end">
                  <Text className="text-sm font-semibold text-muted">×{item.quantity}</Text>
                  {item.price && (
                    <Text className="text-base font-bold text-primary mt-1">
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <Card className="mb-4 p-5 bg-warning/5 border-2 border-warning/30">
            <View className="flex-row items-center mb-2">
              <Ionicons name="alert-circle" size={20} color="#F59E0B" />
              <Text className="text-base font-bold text-warning ml-2 uppercase">Order Note</Text>
            </View>
            <Text className="text-base text-foreground leading-6">{order.specialInstructions}</Text>
          </Card>
        )}

        {/* Total Card */}
        <Card className="mb-6 p-5 bg-primary/5 border-2 border-primary/20">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm font-bold text-muted uppercase tracking-wider">Total Amount</Text>
            <Text className="text-3xl font-extrabold text-primary">
              {formatCurrency(order.totalAmount)}
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Action Buttons - Fixed Bottom */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border/80 p-5 pb-8 gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        {order.status === 'new' && (
          <>
            <Button
              label="Accept Order"
              variant="primary"
              size="lg"
              onPress={() => handleStatusUpdate('accepted')}
              loading={isUpdating}
              icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
            />
            <Button
              label="Reject Order"
              variant="danger"
              size="lg"
              onPress={handleRejectOrder}
              loading={isUpdating}
              icon={<Ionicons name="close-circle" size={20} color="white" />}
            />
          </>
        )}

        {order.status === 'accepted' && (
          <Button
            label="Start Preparing"
            variant="primary"
            size="lg"
            onPress={() => handleStatusUpdate('preparing')}
            loading={isUpdating}
            icon={<Ionicons name="flame" size={20} color="white" />}
          />
        )}

        {order.status === 'preparing' && (
          <Button
            label="Mark Ready for Pickup"
            variant="success"
            size="lg"
            onPress={() => handleStatusUpdate('ready')}
            loading={isUpdating}
            icon={<Ionicons name="checkmark-done" size={20} color="white" />}
          />
        )}

        {order.status === 'ready' && (
          <Button
            label="Complete Order"
            variant="success"
            size="lg"
            onPress={() => handleStatusUpdate('completed')}
            loading={isUpdating}
            icon={<Ionicons name="checkmark-circle" size={20} color="white" />}
          />
        )}

        {(order.status === 'completed' || order.status === 'rejected') && (
          <Button
            label="Back to Dashboard"
            variant="outline"
            size="lg"
            onPress={() => router.back()}
            icon={<Ionicons name="arrow-back" size={20} color="#0F172A" />}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
