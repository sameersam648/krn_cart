import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderStatus } from '@/types';

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  removeOrder: (orderId: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders on app start
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveOrders = async (updatedOrders: Order[]) => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Failed to save orders:', error);
      throw error;
    }
  };

  const addOrder = async (order: Order) => {
    try {
      const updatedOrders = [order, ...orders];
      await saveOrders(updatedOrders);
    } catch (error) {
      console.error('Failed to add order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updatedOrders = orders.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: Date.now() }
          : order
      );
      await saveOrders(updatedOrders);
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  };

  const removeOrder = async (orderId: string) => {
    try {
      const updatedOrders = orders.filter(order => order.id !== orderId);
      await saveOrders(updatedOrders);
    } catch (error) {
      console.error('Failed to remove order:', error);
      throw error;
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const refreshOrders = async () => {
    // In production, this would fetch from backend API
    // For now, just reload from storage
    await loadOrders();
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        addOrder,
        updateOrderStatus,
        removeOrder,
        getOrderById,
        refreshOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
