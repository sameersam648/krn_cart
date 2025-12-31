import React from 'react';
import { Text, View } from 'react-native';
import { OrderStatus } from '@/types';
import { getStatusColor, getStatusLabel } from '@/lib/order-utils';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  const sizeClasses = {
    small: 'px-2 py-1',
    medium: 'px-3 py-1.5',
    large: 'px-4 py-2',
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  return (
    <View
      style={{ backgroundColor: color }}
      className={`rounded-full ${sizeClasses[size]}`}
    >
      <Text className={`font-semibold text-white ${textSizes[size]}`}>
        {label}
      </Text>
    </View>
  );
}
