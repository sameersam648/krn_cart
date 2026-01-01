import React, { useState } from 'react';
import { FlatList, Text, View, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useOrders } from '@/lib/order-context';
import { getElapsedTime, getStatusLabel } from '@/lib/order-utils';
import { StatusBadge } from '@/components/status-badge';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
    const actions: Record<string, { label: string; nextStatus: any; variant: 'primary' | 'success' }> = {
      accepted: { label: 'Start Cooking', nextStatus: 'preparing', variant: 'primary' },
      preparing: { label: 'Mark Ready', nextStatus: 'ready', variant: 'success' },
      ready: { label: 'Complete Order', nextStatus: 'completed', variant: 'success' },
    };
    return actions[status];
  };

  const renderKitchenCard = ({ item }: any) => {
    const action = getNextAction(item.status);
    const elapsedTime = getElapsedTime(item.createdAt);
    const isUrgent = parseInt(elapsedTime.split(' ')[0]) > 10; // More than 10 minutes

    return (
      <View className="px-4 mb-5">
        <Card className={`p-5 ${isUrgent ? 'border-4 border-warning' : 'border-2 border-border/50'}`}>
          {/* Order ID - Extra Large for Kitchen */}
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-6xl font-extrabold text-foreground">
              #{item.id.replace('order_', '')}
            </Text>
            {isUrgent && (
              <View className="bg-warning/20 p-3 rounded-full">
                <Ionicons name="alert-circle" size={32} color="#F59E0B" />
              </View>
            )}
          </View>

          {/* Status and Time - Large */}
          <View className="flex-row justify-between items-center mb-5 pb-4 border-b-2 border-border/30">
            <StatusBadge status={item.status} size="large" />
            <View className="flex-row items-center bg-primary/10 px-4 py-2 rounded-xl">
              <Ionicons name="time" size={24} color="#FF6B35" />
              <Text className="text-xl font-bold text-primary ml-2">{elapsedTime}</Text>
            </View>
          </View>

          {/* Items - Extra Large for Kitchen Readability */}
          <View className="mb-5 bg-primary/5 rounded-xl p-4 border-2 border-primary/20">
            <Text className="text-sm font-bold text-muted uppercase tracking-wider mb-3">Items</Text>
            {item.items.map((itemObj: any) => (
              <View key={itemObj.id} className="mb-3">
                <Text className="text-3xl font-extrabold text-foreground">
                  {itemObj.quantity}× {itemObj.name}
                </Text>
                {itemObj.specialInstructions && (
                  <View className="bg-warning/10 border-2 border-warning rounded-lg p-3 mt-2">
                    <View className="flex-row items-center">
                      <Ionicons name="warning" size={20} color="#F59E0B" />
                      <Text className="text-base font-bold text-warning ml-2 uppercase">Special Request</Text>
                    </View>
                    <Text className="text-lg text-foreground mt-2 font-semibold">
                      {itemObj.specialInstructions}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Overall Special Instructions */}
          {item.specialInstructions && (
            <View className="mb-5 bg-warning/10 rounded-xl p-4 border-2 border-warning">
              <View className="flex-row items-center mb-2">
                <Ionicons name="alert-circle" size={24} color="#F59E0B" />
                <Text className="text-base font-extrabold text-warning ml-2 uppercase tracking-wide">Order Note</Text>
              </View>
              <Text className="text-xl text-foreground font-semibold leading-6">{item.specialInstructions}</Text>
            </View>
          )}

          {/* Action Button - Extra Large */}
          {action && (
            <Button
              label={action.label}
              variant={action.variant}
              size="xl"
              onPress={() => handleStatusUpdate(item.id, action.nextStatus)}
              loading={isUpdating}
              icon={<Ionicons name="checkmark-circle" size={24} color="white" />}
            />
          )}
        </Card>
      </View>
    );
  };

  return (
    <ScreenContainer className="p-0 bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 pt-6 pb-4 bg-surface border-b border-border/40">
          <Text className="text-3xl font-extrabold text-foreground mb-2">Kitchen View</Text>
          <View className="flex-row items-center">
            <View className="bg-success/10 px-3 py-2 rounded-lg">
              <Text className="text-lg font-extrabold text-success">
                {activeOrders.length} Active
              </Text>
            </View>
          </View>
        </View>

        {/* Kitchen Orders */}
        {activeOrders.length === 0 ? (
          <View className="flex-1 justify-center items-center p-8">
            <View className="bg-success/10 p-8 rounded-full mb-6">
              <Ionicons name="checkmark-done-circle" size={80} color="#10B981" />
            </View>
            <Text className="text-3xl font-extrabold text-foreground mb-3">All Caught Up!</Text>
            <Text className="text-xl text-muted text-center">No active orders right now 🎉</Text>
          </View>
        ) : (
          <FlatList
            data={activeOrders}
            keyExtractor={item => item.id}
            renderItem={renderKitchenCard}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
