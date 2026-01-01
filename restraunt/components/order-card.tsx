import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Order } from '@/types';
import { formatCurrency, getElapsedTime, getStatusColor, getStatusLabel } from '@/lib/order-utils';
import { cn } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  const statusColor = getStatusColor(order.status);
  const elapsedTime = getElapsedTime(order.createdAt);
  const isUrgent = order.status === 'new';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Card className={cn(
        "mb-3 p-4 border-2",
        isUrgent ? "border-primary bg-primary/5" : "border-border/50 bg-surface"
      )}>
        {/* Header: Order ID and Status */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-row items-center">
            <View className={cn(
              "w-10 h-10 rounded-full items-center justify-center mr-3",
              isUrgent ? "bg-primary/20" : "bg-muted/10"
            )}>
              <Ionicons
                name={isUrgent ? "alert-circle" : "receipt"}
                size={22}
                color={isUrgent ? "#FF6B35" : "#64748B"}
              />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-foreground">
                #{order.id.replace('order_', '')}
              </Text>
              <Text className="text-xs text-muted">{elapsedTime}</Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: statusColor }}
            className="px-3 py-1.5 rounded-full"
          >
            <Text className="text-xs font-bold text-white uppercase tracking-wide">
              {getStatusLabel(order.status)}
            </Text>
          </View>
        </View>

        {/* Customer Name */}
        <View className="flex-row items-center mb-3">
          <Ionicons name="person" size={16} color="#64748B" />
          <Text className="text-base font-semibold text-foreground ml-2">
            {order.customerName}
          </Text>
        </View>

        {/* Items Summary */}
        <View className="bg-muted/5 rounded-lg p-3 mb-3">
          <Text className="text-xs font-semibold text-muted mb-2 uppercase tracking-wide">
            {order.items.length} Item{order.items.length !== 1 ? 's' : ''}
          </Text>
          {order.items.slice(0, 2).map((item) => (
            <Text key={item.id} className="text-sm text-foreground mb-1">
              <Text className="font-bold text-primary">{item.quantity}x</Text> {item.name}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text className="text-xs text-muted mt-1 italic">
              +{order.items.length - 2} more item{order.items.length - 2 !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Footer: Total Amount */}
        <View className="flex-row justify-between items-center pt-3 border-t border-border/30">
          <Text className="text-xs text-muted uppercase font-bold">Total Amount</Text>
          <Text className="text-xl font-extrabold text-primary">
            {formatCurrency(order.totalAmount)}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
