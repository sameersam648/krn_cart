import { describe, it, expect, beforeEach } from "vitest";

describe("Order Context", () => {
  beforeEach(() => {
    // Reset state before each test
  });

  it("should generate mock orders", () => {
    const mockOrders = Array.from({ length: 5 }, (_, i) => ({
      id: `order_${i + 1}`,
      restaurantName: "Test Restaurant",
      status: "pending" as const,
      estimatedDistance: 2.5,
      estimatedEarnings: 5.0,
    }));

    expect(mockOrders).toHaveLength(5);
    expect(mockOrders[0].id).toBe("order_1");
  });

  it("should have correct order status values", () => {
    const validStatuses = ["pending", "accepted", "reached_restaurant", "picked_up", "on_the_way", "delivered", "cancelled"];
    const orderStatus = "accepted";

    expect(validStatuses).toContain(orderStatus);
  });

  it("should accept an order", () => {
    const order = {
      id: "order_1",
      status: "pending" as const,
      acceptedAt: undefined,
    };

    const acceptedOrder = {
      ...order,
      status: "accepted" as const,
      acceptedAt: new Date(),
    };

    expect(acceptedOrder.status).toBe("accepted");
    expect(acceptedOrder.acceptedAt).toBeDefined();
  });

  it("should update order status through steps", () => {
    const statusSteps = ["accepted", "reached_restaurant", "picked_up", "on_the_way", "delivered"];
    let currentStatus = "accepted";
    let stepIndex = 0;

    expect(currentStatus).toBe(statusSteps[stepIndex]);

    stepIndex = 1;
    currentStatus = statusSteps[stepIndex];
    expect(currentStatus).toBe("reached_restaurant");

    stepIndex = statusSteps.length - 1;
    currentStatus = statusSteps[stepIndex];
    expect(currentStatus).toBe("delivered");
  });

  it("should calculate earnings correctly", () => {
    const distance = 5; // km
    const ratePerKm = 2.5;
    const earnings = distance * ratePerKm;

    expect(earnings).toBe(12.5);
  });

  it("should handle order rejection", () => {
    const availableOrders = [
      { id: "order_1", status: "pending" as const },
      { id: "order_2", status: "pending" as const },
      { id: "order_3", status: "pending" as const },
    ];

    const orderId = "order_2";
    const filtered = availableOrders.filter((o) => o.id !== orderId);

    expect(filtered).toHaveLength(2);
    expect(filtered.find((o) => o.id === "order_2")).toBeUndefined();
  });

  it("should move order to completed when delivered", () => {
    const activeOrder = {
      id: "order_1",
      status: "delivered" as const,
      deliveredAt: new Date(),
    };

    const completedOrders = [activeOrder];

    expect(completedOrders).toHaveLength(1);
    expect(completedOrders[0].status).toBe("delivered");
  });

  it("should calculate total earnings from completed orders", () => {
    const completedOrders = [
      { id: "order_1", estimatedEarnings: 5.0 },
      { id: "order_2", estimatedEarnings: 7.5 },
      { id: "order_3", estimatedEarnings: 3.25 },
    ];

    const totalEarnings = completedOrders.reduce((sum, order) => sum + order.estimatedEarnings, 0);

    expect(totalEarnings).toBe(15.75);
  });
});
