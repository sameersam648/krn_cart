import React, { createContext, useContext, useState } from "react";

export type OrderStatus = "pending" | "accepted" | "reached_restaurant" | "picked_up" | "on_the_way" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantLat: number;
  restaurantLng: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  items: OrderItem[];
  specialInstructions?: string;
  estimatedDistance: number; // in km
  estimatedEarnings: number;
  status: OrderStatus;
  acceptedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

export interface OrderContextType {
  availableOrders: Order[];
  activeOrder: Order | null;
  completedOrders: Order[];
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  addMockOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Mock order data generator
const generateMockOrders = (): Order[] => {
  const restaurants = [
    { name: "Pizza Palace", address: "123 Main St", lat: 40.7128, lng: -74.006 },
    { name: "Burger Barn", address: "456 Oak Ave", lat: 40.758, lng: -73.9855 },
    { name: "Sushi Supreme", address: "789 Park Blvd", lat: 40.7489, lng: -73.9680 },
    { name: "Taco Fiesta", address: "321 Elm St", lat: 40.7614, lng: -73.9776 },
  ];

  const customers = [
    { name: "John Doe", phone: "+1234567890", address: "100 Broadway", lat: 40.7505, lng: -73.9972 },
    { name: "Jane Smith", phone: "+1234567891", address: "200 5th Ave", lat: 40.7549, lng: -73.9840 },
    { name: "Bob Johnson", phone: "+1234567892", address: "300 Madison Ave", lat: 40.7535, lng: -73.9822 },
    { name: "Alice Williams", phone: "+1234567893", address: "400 Park Ave", lat: 40.7614, lng: -73.9776 },
  ];

  const items = [
    { id: "1", name: "Margherita Pizza", quantity: 1, price: 12.99 },
    { id: "2", name: "Cheeseburger", quantity: 2, price: 8.99 },
    { id: "3", name: "California Roll", quantity: 1, price: 9.99 },
    { id: "4", name: "Carne Asada Tacos", quantity: 3, price: 3.99 },
  ];

  return Array.from({ length: 5 }, (_, i) => {
    const restaurant = restaurants[i % restaurants.length];
    const customer = customers[i % customers.length];
    const distance = Math.random() * 5 + 1; // 1-6 km

    return {
      id: `order_${i + 1}`,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      restaurantLat: restaurant.lat + Math.random() * 0.01,
      restaurantLng: restaurant.lng + Math.random() * 0.01,
      customerName: customer.name,
      customerPhone: customer.phone,
      deliveryAddress: customer.address,
      deliveryLat: customer.lat + Math.random() * 0.01,
      deliveryLng: customer.lng + Math.random() * 0.01,
      items: [items[i % items.length]],
      specialInstructions: i % 3 === 0 ? "Ring doorbell twice" : undefined,
      estimatedDistance: Math.round(distance * 10) / 10,
      estimatedEarnings: Math.round(distance * 2.5 * 100) / 100,
      status: "pending",
      createdAt: new Date(Date.now() - i * 300000), // Stagger by 5 minutes
    };
  });
};

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [availableOrders, setAvailableOrders] = useState<Order[]>(generateMockOrders());
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [completedOrders, setCompletedOrders] = useState<Order[]>([]);

  const acceptOrder = (orderId: string) => {
    const order = availableOrders.find((o) => o.id === orderId);
    if (order) {
      const acceptedOrder = {
        ...order,
        status: "accepted" as OrderStatus,
        acceptedAt: new Date(),
      };
      setActiveOrder(acceptedOrder);
      setAvailableOrders(availableOrders.filter((o) => o.id !== orderId));
    }
  };

  const rejectOrder = (orderId: string) => {
    setAvailableOrders(availableOrders.filter((o) => o.id !== orderId));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    if (activeOrder && activeOrder.id === orderId) {
      const updatedOrder = {
        ...activeOrder,
        status,
        deliveredAt: status === "delivered" ? new Date() : activeOrder.deliveredAt,
      };
      setActiveOrder(updatedOrder);

      // Move to completed orders if delivered
      if (status === "delivered" || status === "cancelled") {
        setCompletedOrders([...completedOrders, updatedOrder]);
        setActiveOrder(null);
      }
    }
  };

  const getOrderById = (orderId: string): Order | undefined => {
    const found = availableOrders.find((o) => o.id === orderId);
    if (found) return found;
    if (activeOrder?.id === orderId) return activeOrder;
    return completedOrders.find((o) => o.id === orderId);
  };

  const addMockOrders = () => {
    setAvailableOrders([...availableOrders, ...generateMockOrders()]);
  };

  const value: OrderContextType = {
    availableOrders,
    activeOrder,
    completedOrders,
    acceptOrder,
    rejectOrder,
    updateOrderStatus,
    getOrderById,
    addMockOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
