import { eq, like, desc, asc, and, or, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  restaurants,
  riders,
  orders,
  orderItems,
  categories,
  menuItems,
  platformSettings,
  notifications,
  notificationReadStatus,
  deliveryHistory,
  auditLog,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// User Management Queries
export async function getAllUsers(
  limit: number = 10,
  offset: number = 0,
  search?: string,
  userType?: string,
  isActive?: boolean
) {
  const db = await getDb();
  if (!db) {
    // Return mock data when database is not available
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", phone: "9876543210", userType: "customer", isActive: true, createdAt: new Date() },
      { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "9876543211", userType: "customer", isActive: true, createdAt: new Date() },
      { id: 3, name: "Ramesh Kumar", email: "ramesh@example.com", phone: "9876543212", userType: "customer", isActive: true, createdAt: new Date() },
      { id: 4, name: "Priya Sharma", email: "priya@example.com", phone: "9876543213", userType: "customer", isActive: false, createdAt: new Date() },
      { id: 5, name: "Suresh Patel", email: "suresh@example.com", phone: "9876543214", userType: "customer", isActive: true, createdAt: new Date() },
    ];
    return { users: mockUsers.slice(offset, offset + limit), total: mockUsers.length };
  }

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        like(users.name, `%${search}%`),
        like(users.email, `%${search}%`),
        like(users.phone, `%${search}%`)
      )
    );
  }
  if (userType) {
    conditions.push(eq(users.userType, userType as any));
  }
  if (isActive !== undefined) {
    conditions.push(eq(users.isActive, isActive));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select()
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: users.id })
    .from(users)
    .where(whereClause);

  return {
    users: result,
    total: countResult[0]?.count || 0,
  };
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateUserStatus(userId: number, isActive: boolean) {
  const db = await getDb();
  if (!db) return null;

  await db.update(users).set({ isActive }).where(eq(users.id, userId));
  return getUserById(userId);
}

// Restaurant Management Queries
export async function getAllRestaurants(
  limit: number = 10,
  offset: number = 0,
  search?: string,
  status?: string,
  isActive?: boolean
) {
  const db = await getDb();
  if (!db) {
    const mockRestaurants = [
      { id: 1, name: "Udupi Hotel", email: "udupi@example.com", city: "Bangalore", status: "active", isActive: true, createdAt: new Date() },
      { id: 2, name: "Shree Hotel", email: "shree@example.com", city: "Mumbai", status: "active", isActive: true, createdAt: new Date() },
      { id: 3, name: "Shree Tiffanys", email: "tiffanys@example.com", city: "Chennai", status: "pending", isActive: false, createdAt: new Date() },
      { id: 4, name: "Kanteshwara Cafe", email: "kanteshwara@example.com", city: "Hyderabad", status: "active", isActive: true, createdAt: new Date() },
    ];
    return { restaurants: mockRestaurants.slice(offset, offset + limit), total: mockRestaurants.length };
  }

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        like(restaurants.name, `%${search}%`),
        like(restaurants.email, `%${search}%`),
        like(restaurants.city, `%${search}%`)
      )
    );
  }
  if (status) {
    conditions.push(eq(restaurants.status, status as any));
  }
  if (isActive !== undefined) {
    conditions.push(eq(restaurants.isActive, isActive));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select()
    .from(restaurants)
    .where(whereClause)
    .orderBy(desc(restaurants.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: restaurants.id })
    .from(restaurants)
    .where(whereClause);

  return {
    restaurants: result,
    total: countResult[0]?.count || 0,
  };
}

export async function getRestaurantById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateRestaurantStatus(
  restaurantId: number,
  status: string,
  isActive?: boolean
) {
  const db = await getDb();
  if (!db) return null;

  const updateData: any = { status };
  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  await db
    .update(restaurants)
    .set(updateData)
    .where(eq(restaurants.id, restaurantId));
  return getRestaurantById(restaurantId);
}

export async function getRestaurantOrders(restaurantId: number, limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) return { orders: [], total: 0 };

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.restaurantId, restaurantId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: orders.id })
    .from(orders)
    .where(eq(orders.restaurantId, restaurantId));

  return {
    orders: result,
    total: countResult[0]?.count || 0,
  };
}

// Rider Management Queries
export async function getAllRiders(
  limit: number = 10,
  offset: number = 0,
  search?: string,
  status?: string,
  isActive?: boolean
) {
  const db = await getDb();
  if (!db) {
    const mockRiders = [
      { id: 1, name: "Vijay Kumar", email: "vijay@example.com", phone: "9876543220", status: "active", isActive: true, createdAt: new Date() },
      { id: 2, name: "Raju Singh", email: "raju@example.com", phone: "9876543221", status: "active", isActive: true, createdAt: new Date() },
      { id: 3, name: "Anil Verma", email: "anil@example.com", phone: "9876543222", status: "pending", isActive: false, createdAt: new Date() },
    ];
    return { riders: mockRiders.slice(offset, offset + limit), total: mockRiders.length };
  }

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        like(riders.name, `%${search}%`),
        like(riders.email, `%${search}%`),
        like(riders.phone, `%${search}%`)
      )
    );
  }
  if (status) {
    conditions.push(eq(riders.status, status as any));
  }
  if (isActive !== undefined) {
    conditions.push(eq(riders.isActive, isActive));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select()
    .from(riders)
    .where(whereClause)
    .orderBy(desc(riders.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: riders.id })
    .from(riders)
    .where(whereClause);

  return {
    riders: result,
    total: countResult[0]?.count || 0,
  };
}

export async function getRiderById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(riders).where(eq(riders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateRiderStatus(
  riderId: number,
  status: string,
  isActive?: boolean
) {
  const db = await getDb();
  if (!db) return null;

  const updateData: any = { status };
  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  await db
    .update(riders)
    .set(updateData)
    .where(eq(riders.id, riderId));
  return getRiderById(riderId);
}

export async function getRiderDeliveryHistory(riderId: number, limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) return { history: [], total: 0 };

  const result = await db
    .select()
    .from(deliveryHistory)
    .where(eq(deliveryHistory.riderId, riderId))
    .orderBy(desc(deliveryHistory.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: deliveryHistory.id })
    .from(deliveryHistory)
    .where(eq(deliveryHistory.riderId, riderId));

  return {
    history: result,
    total: countResult[0]?.count || 0,
  };
}

// Order Management Queries
export async function getAllOrders(
  limit: number = 10,
  offset: number = 0,
  search?: string,
  status?: string,
  startDate?: Date,
  endDate?: Date
) {
  const db = await getDb();
  if (!db) {
    const mockOrders = [
      { id: 1, orderNumber: "ORD-001", status: "pending", totalAmount: 250, paymentStatus: "completed", createdAt: new Date() },
      { id: 2, orderNumber: "ORD-002", status: "preparing", totalAmount: 180, paymentStatus: "completed", createdAt: new Date() },
      { id: 3, orderNumber: "ORD-003", status: "delivered", totalAmount: 320, paymentStatus: "completed", createdAt: new Date() },
      { id: 4, orderNumber: "ORD-004", status: "in_transit", totalAmount: 150, paymentStatus: "completed", createdAt: new Date() },
      { id: 5, orderNumber: "ORD-005", status: "cancelled", totalAmount: 200, paymentStatus: "refunded", createdAt: new Date() },
    ];
    return { orders: mockOrders.slice(offset, offset + limit), total: mockOrders.length };
  }

  const conditions = [];
  if (search) {
    conditions.push(like(orders.orderNumber, `%${search}%`));
  }
  if (status) {
    conditions.push(eq(orders.status, status as any));
  }
  if (startDate && endDate) {
    conditions.push(
      and(gte(orders.createdAt, startDate), lte(orders.createdAt, endDate))
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select()
    .from(orders)
    .where(whereClause)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: orders.id })
    .from(orders)
    .where(whereClause);

  return {
    orders: result,
    total: countResult[0]?.count || 0,
  };
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function updateOrderStatus(orderId: number, status: string) {
  const db = await getDb();
  if (!db) return null;

  await db.update(orders).set({ status: status as any }).where(eq(orders.id, orderId));
  return getOrderById(orderId);
}

export async function cancelOrder(orderId: number, reason: string, refundAmount?: number) {
  const db = await getDb();
  if (!db) return null;

  const updateData: any = {
    status: "cancelled",
    cancellationReason: reason,
  };
  if (refundAmount !== undefined) {
    updateData.refundAmount = refundAmount;
    updateData.paymentStatus = "refunded";
  }

  await db.update(orders).set(updateData).where(eq(orders.id, orderId));
  return getOrderById(orderId);
}

// Category Management Queries
export async function getAllCategories(limit: number = 100, offset: number = 0) {
  const db = await getDb();
  if (!db) {
    const mockCategories = [
      { id: 1, name: "Breakfast", description: "Morning meals", isActive: true, displayOrder: 1 },
      { id: 2, name: "Lunch", description: "Afternoon meals", isActive: true, displayOrder: 2 },
      { id: 3, name: "Dinner", description: "Evening meals", isActive: true, displayOrder: 3 },
      { id: 4, name: "Snacks", description: "Quick bites", isActive: true, displayOrder: 4 },
      { id: 5, name: "Beverages", description: "Drinks", isActive: true, displayOrder: 5 },
    ];
    return { categories: mockCategories.slice(offset, offset + limit), total: mockCategories.length };
  }

  const result = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.displayOrder))
    .limit(limit)
    .offset(offset);

  const countResult = await db.select({ count: categories.id }).from(categories);

  return {
    categories: result,
    total: countResult[0]?.count || 0,
  };
}

export async function createCategory(data: any) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(categories).values(data);
  return result;
}

export async function updateCategory(id: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  await db.update(categories).set(data).where(eq(categories.id, id));
  const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Menu Items Queries
export async function getRestaurantMenuItems(
  restaurantId: number,
  limit: number = 100,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const result = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.restaurantId, restaurantId))
    .orderBy(desc(menuItems.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: menuItems.id })
    .from(menuItems)
    .where(eq(menuItems.restaurantId, restaurantId));

  return {
    items: result,
    total: countResult[0]?.count || 0,
  };
}

export async function updateMenuItemStatus(itemId: number, status: string, isActive?: boolean) {
  const db = await getDb();
  if (!db) return null;

  const updateData: any = { status };
  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  await db.update(menuItems).set(updateData).where(eq(menuItems.id, itemId));
  const result = await db.select().from(menuItems).where(eq(menuItems.id, itemId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Platform Settings Queries
export async function getPlatformSettings(key?: string) {
  const db = await getDb();
  if (!db) return key ? null : [];

  if (key) {
    const result = await db
      .select()
      .from(platformSettings)
      .where(eq(platformSettings.key, key))
      .limit(1);
    return result.length > 0 ? result[0] : null;
  }

  return await db.select().from(platformSettings);
}

export async function updatePlatformSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getPlatformSettings(key);
  if (existing) {
    await db
      .update(platformSettings)
      .set({ value })
      .where(eq(platformSettings.key, key));
  } else {
    await db.insert(platformSettings).values({ key, value });
  }

  return getPlatformSettings(key);
}

// Notification Queries
export async function createNotification(data: any) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(notifications).values(data);
  return result;
}

export async function getNotifications(limit: number = 10, offset: number = 0) {
  const db = await getDb();
  if (!db) return { notifications: [], total: 0 };

  const result = await db
    .select()
    .from(notifications)
    .orderBy(desc(notifications.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db.select({ count: notifications.id }).from(notifications);

  return {
    notifications: result,
    total: countResult[0]?.count || 0,
  };
}

// Dashboard Analytics Queries
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) {
    // Return mock stats when database is not available
    return {
      totalOrders: 127,
      totalUsers: 45,
      totalRestaurants: 12,
      totalRiders: 8,
      todayOrders: 15,
      activeOrders: 7,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalOrders, totalUsers, totalRestaurants, totalRiders, todayOrders, activeOrders] = await Promise.all([
    db.select({ count: orders.id }).from(orders),
    db.select({ count: users.id }).from(users),
    db.select({ count: restaurants.id }).from(restaurants),
    db.select({ count: riders.id }).from(riders),
    db
      .select({ count: orders.id })
      .from(orders)
      .where(gte(orders.createdAt, today)),
    db
      .select({ count: orders.id })
      .from(orders)
      .where(
        or(
          eq(orders.status, "pending"),
          eq(orders.status, "confirmed"),
          eq(orders.status, "preparing"),
          eq(orders.status, "ready"),
          eq(orders.status, "picked_up"),
          eq(orders.status, "in_transit")
        )
      ),
  ]);

  return {
    totalOrders: totalOrders[0]?.count || 0,
    totalUsers: totalUsers[0]?.count || 0,
    totalRestaurants: totalRestaurants[0]?.count || 0,
    totalRiders: totalRiders[0]?.count || 0,
    todayOrders: todayOrders[0]?.count || 0,
    activeOrders: activeOrders[0]?.count || 0,
  };
}

export async function getRevenueStats(days: number = 30) {
  const db = await getDb();
  if (!db) {
    // Return mock revenue data
    const mockRevenue = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockRevenue.push({
        date: date,
        total: String(Math.floor(Math.random() * 5000) + 1000),
      });
    }
    return mockRevenue;
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await db
    .select({
      date: orders.createdAt,
      total: orders.totalAmount,
    })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, startDate),
        eq(orders.paymentStatus, "completed")
      )
    )
    .orderBy(asc(orders.createdAt));
}

// Audit Log Queries
export async function createAuditLog(adminId: number, action: string, entityType?: string, entityId?: number, details?: any) {
  const db = await getDb();
  if (!db) return null;

  return await db.insert(auditLog).values({
    adminId,
    action,
    entityType,
    entityId,
    details,
  });
}
