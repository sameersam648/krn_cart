import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartItem, MenuItem, OrderType, SubscriptionData, CustomOrderData } from "./mock-data";

interface CartContextType {
  items: CartItem[];
  addItem: (restaurantId: string, menuItem: MenuItem, quantity: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  isLoading: boolean;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  scheduledDateTime: Date | null;
  setScheduledDateTime: (date: Date | null) => void;
  subscriptionData: SubscriptionData | null;
  setSubscriptionData: (data: SubscriptionData | null) => void;
  customOrderData: CustomOrderData | null;
  setCustomOrderData: (data: CustomOrderData | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 50;
const TAX_RATE = 0.05; // 5% tax

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderType, setOrderType] = useState<OrderType>('quick');
  const [scheduledDateTime, setScheduledDateTime] = useState<Date | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [customOrderData, setCustomOrderData] = useState<CustomOrderData | null>(null);

  // Load cart from AsyncStorage on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        }
      } catch (e) {
        console.error("Failed to load cart:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever items change
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cart", JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart:", e);
      }
    };

    if (!isLoading) {
      saveCart();
    }
  }, [items, isLoading]);

  const addItem = (restaurantId: string, menuItem: MenuItem, quantity: number) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItem = prevItems.find((item) => item.menuItem.id === menuItem.id);

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        const newCartItem: CartItem = {
          id: Math.random().toString(36).substr(2, 9),
          restaurantId,
          menuItem,
          quantity,
        };
        return [...prevItems, newCartItem];
      }
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.menuItem.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.menuItem.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  };

  const getTax = () => {
    return Math.round(getSubtotal() * TAX_RATE);
  };

  const getDeliveryFee = () => {
    return items.length > 0 ? DELIVERY_FEE : 0;
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getSubtotal,
    getTax,
    getDeliveryFee,
    isLoading,
    orderType,
    setOrderType,
    scheduledDateTime,
    setScheduledDateTime,
    subscriptionData,
    setSubscriptionData,
    customOrderData,
    setCustomOrderData,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
