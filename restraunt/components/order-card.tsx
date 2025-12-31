import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Order } from '@/types';
import { formatCurrency, getElapsedTime, getStatusColor, getStatusLabel } from '@/lib/order-utils';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const statusColor = getStatusColor(order.status);
  const elapsedTime = getElapsedTime(order.createdAt);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-lg p-4 mb-3 border border-border">
        {/* Header: Order ID and Status */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground">
              Order #{order.id.replace('order_', '')}
            </Text>
            <Text className="text-sm text-muted mt-1">{elapsedTime}</Text>
          </View>
          <View
            style={{ backgroundColor: statusColor }}
            className="px-3 py-1 rounded-full"
          >
            <Text className="text-xs font-semibold text-white">
              {getStatusLabel(order.status)}
            </Text>
          </View>
        </View>

        {/* Customer Name */}
        <Text className="text-base font-semibold text-foreground mb-2">
          {order.customerName}
        </Text>

        {/* Items Summary */}
        <View className="mb-3">
          <Text className="text-sm text-muted">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </Text>
          <View className="mt-1">
            {order.items.slice(0, 2).map((item) => (
              <Text key={item.id} className="text-sm text-foreground">
                • {item.name} x{item.quantity}
              </Text>
            ))}
            {order.items.length > 2 && (
              <Text className="text-sm text-muted mt-1">
                +{order.items.length - 2} more
              </Text>
            )}
          </View>
        </View>

        {/* Footer: Total Amount */}
        <View className="flex-row justify-between items-center pt-3 border-t border-border">
          <Text className="text-sm text-muted">Total</Text>
          <Text className="text-lg font-bold text-primary">
            {formatCurrency(order.totalAmount)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
