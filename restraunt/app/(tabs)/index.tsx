import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { OrderCard } from '@/components/order-card';
import { useOrders } from '@/lib/order-context';
import { generateMockOrders } from '@/lib/mock-data';

export default function HomeScreen() {
  const router = useRouter();
  const { orders, isLoading, addOrder, refreshOrders } = useOrders();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasInitialData, setHasInitialData] = useState(false);

  // Initialize with mock data on first load
  useEffect(() => {
    const initializeMockData = async () => {
      if (!hasInitialData && orders.length === 0) {
        const mockOrders = generateMockOrders(5);
        for (const order of mockOrders) {
          await addOrder(order);
        }
        setHasInitialData(true);
      }
    };

    initializeMockData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshOrders();
      // Simulate adding a new order on refresh
      const newOrder = generateMockOrders(1)[0];
      newOrder.id = `order_${Date.now()}`;
      await addOrder(newOrder);
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOrderPress = (orderId: string) => {
    router.push({
      pathname: '/order-details',
      params: { orderId },
    });
  };

  const newOrders = orders.filter(order => order.status === 'new');
  const activeOrders = orders.filter(order => ['accepted', 'preparing', 'ready'].includes(order.status));
  const completedOrders = orders.filter(order => ['completed', 'rejected'].includes(order.status));

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-12">
      <Text className="text-lg text-muted text-center">No orders yet</Text>
      <Text className="text-sm text-muted text-center mt-2">
        Pull down to refresh or wait for new orders
      </Text>
    </View>
  );

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="px-4 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">Orders</Text>
          <Text className="text-sm text-muted mt-1">
            {newOrders.length} new • {activeOrders.length} active
          </Text>
        </View>

        {/* Orders List */}
        {orders.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View className="px-4">
                <OrderCard
                  order={item}
                  onPress={() => handleOrderPress(item.id)}
                />
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#FF6B35"
              />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            ListHeaderComponent={
              newOrders.length > 0 ? (
                <View className="pb-3 mb-3 border-b border-border">
                  <Text className="text-xs font-semibold text-primary uppercase tracking-wide">
                    New Orders
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}
