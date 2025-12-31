import { Order, OrderItem } from '@/types';

const mockItems: Record<string, OrderItem[]> = {
  order1: [
    { id: 'item1', name: 'Margherita Pizza', quantity: 1, price: 12.99 },
    { id: 'item2', name: 'Caesar Salad', quantity: 2, price: 8.99 },
    { id: 'item3', name: 'Garlic Bread', quantity: 1, price: 4.99 },
  ],
  order2: [
    { id: 'item4', name: 'Grilled Salmon', quantity: 1, price: 18.99, specialInstructions: 'No lemon' },
    { id: 'item5', name: 'Mashed Potatoes', quantity: 1, price: 5.99 },
    { id: 'item6', name: 'Steamed Broccoli', quantity: 1, price: 6.99 },
  ],
  order3: [
    { id: 'item7', name: 'Chicken Burger', quantity: 2, price: 11.99 },
    { id: 'item8', name: 'French Fries', quantity: 2, price: 3.99 },
    { id: 'item9', name: 'Soft Drink', quantity: 2, price: 2.99 },
  ],
  order4: [
    { id: 'item10', name: 'Pad Thai', quantity: 1, price: 13.99, specialInstructions: 'Extra spicy' },
    { id: 'item11', name: 'Spring Rolls', quantity: 1, price: 5.99 },
  ],
  order5: [
    { id: 'item12', name: 'Sushi Platter', quantity: 1, price: 24.99 },
    { id: 'item13', name: 'Miso Soup', quantity: 1, price: 4.99 },
  ],
};

const customerNames = [
  'John Smith',
  'Sarah Johnson',
  'Michael Chen',
  'Emma Davis',
  'Robert Wilson',
  'Lisa Anderson',
  'James Martinez',
  'Jennifer Taylor',
];

const statuses = ['new', 'accepted', 'preparing', 'ready', 'completed'] as const;

/**
 * Generate mock orders for testing
 */
export function generateMockOrders(count: number = 5): Order[] {
  const orders: Order[] = [];
  const now = Date.now();

  for (let i = 1; i <= count; i++) {
    const items = mockItems[`order${i}`] || mockItems.order1;
    const totalAmount = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const createdAtOffset = Math.floor(Math.random() * 3600000); // Random time within last hour

    orders.push({
      id: `order_${i}`,
      customerId: `cust_${i}`,
      customerName: customerNames[i % customerNames.length],
      customerPhone: `(555) ${String(100 + i).padStart(3, '0')}-${String(1000 + i * 111).padStart(4, '0')}`,
      items,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      status: statuses[statusIndex],
      createdAt: now - createdAtOffset,
      updatedAt: now - Math.floor(createdAtOffset / 2),
      specialInstructions: i % 3 === 0 ? 'Please ring doorbell twice' : undefined,
      estimatedPrepTime: 15 + Math.floor(Math.random() * 30),
    });
  }

  return orders;
}

/**
 * Get a single mock order by ID
 */
export function getMockOrderById(orderId: string): Order | undefined {
  const orders = generateMockOrders(10);
  return orders.find(order => order.id === orderId);
}
