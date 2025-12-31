import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, Order } from "./mock-data";

interface OrdersContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number, deliveryAddress: string) => void;
  getOrders: () => Order[];
  isLoading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders from AsyncStorage on app start
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const storedOrders = await AsyncStorage.getItem("orders");
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      } catch (e) {
        console.error("Failed to load orders:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Save orders to AsyncStorage whenever they change
  useEffect(() => {
    const saveOrders = async () => {
      try {
        await AsyncStorage.setItem("orders", JSON.stringify(orders));
      } catch (e) {
        console.error("Failed to save orders:", e);
      }
    };

    if (!isLoading) {
      saveOrders();
    }
  }, [orders, isLoading]);

  const addOrder = (items: CartItem[], total: number, deliveryAddress: string) => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      items,
      total,
      status: "Confirmed",
      deliveryAddress,
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
  };

  const getOrders = () => {
    return orders;
  };

  const value = {
    orders,
    addOrder,
    getOrders,
    isLoading,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
