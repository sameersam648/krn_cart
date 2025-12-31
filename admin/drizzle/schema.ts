import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow and user management.
 * Supports both admin users and platform users (customers, restaurants, riders).
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "sub_admin"]).default("user").notNull(),
  userType: mysqlEnum("userType", ["customer", "restaurant_owner", "rider", "admin"]).default("customer"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Restaurants table for managing restaurant registrations and details.
 */
export const restaurants = mysqlTable("restaurants", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  cuisineType: varchar("cuisineType", { length: 255 }),
  description: text("description"),
  logo: varchar("logo", { length: 500 }),
  banner: varchar("banner", { length: 500 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "active", "inactive"]).default("pending"),
  isActive: boolean("isActive").default(true).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalOrders: int("totalOrders").default(0),
  commissionPercentage: decimal("commissionPercentage", { precision: 5, scale: 2 }).default("15"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;

/**
 * Riders table for managing delivery personnel.
 */
export const riders = mysqlTable("riders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  licenseNumber: varchar("licenseNumber", { length: 100 }).notNull().unique(),
  vehicleType: mysqlEnum("vehicleType", ["bike", "scooter", "car"]).default("bike"),
  vehicleNumber: varchar("vehicleNumber", { length: 100 }),
  status: mysqlEnum("status", ["pending", "approved", "rejected", "active", "inactive", "blocked"]).default("pending"),
  isActive: boolean("isActive").default(true).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalDeliveries: int("totalDeliveries").default(0),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isOnline: boolean("isOnline").default(false),
  currentOrderId: int("currentOrderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Rider = typeof riders.$inferSelect;
export type InsertRider = typeof riders.$inferInsert;

/**
 * Categories table for food categories.
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 500 }),
  image: varchar("image", { length: 500 }),
  isActive: boolean("isActive").default(true).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Menu items table for restaurant menu items.
 */
export const menuItems = mysqlTable("menuItems", {
  id: int("id").autoincrement().primaryKey(),
  restaurantId: int("restaurantId").notNull(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: varchar("image", { length: 500 }),
  isVegetarian: boolean("isVegetarian").default(false),
  isSpicy: boolean("isSpicy").default(false),
  preparationTime: int("preparationTime"), // in minutes
  isActive: boolean("isActive").default(true).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;

/**
 * Orders table for managing all orders.
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),
  restaurantId: int("restaurantId").notNull(),
  riderId: int("riderId"),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  status: mysqlEnum("status", [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "picked_up",
    "in_transit",
    "delivered",
    "cancelled",
    "refunded",
  ]).default("pending"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: decimal("deliveryFee", { precision: 10, scale: 2 }).default("0"),
  serviceCharge: decimal("serviceCharge", { precision: 10, scale: 2 }).default("0"),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "wallet", "upi"]).default("cash"),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending"),
  deliveryAddress: text("deliveryAddress").notNull(),
  specialInstructions: text("specialInstructions"),
  estimatedDeliveryTime: timestamp("estimatedDeliveryTime"),
  actualDeliveryTime: timestamp("actualDeliveryTime"),
  rating: int("rating"), // 1-5 stars
  review: text("review"),
  cancellationReason: text("cancellationReason"),
  refundAmount: decimal("refundAmount", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table for individual items in an order.
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  menuItemId: int("menuItemId").notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  specialInstructions: text("specialInstructions"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Platform settings table for admin configuration.
 */
export const platformSettings = mysqlTable("platformSettings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  dataType: mysqlEnum("dataType", ["string", "number", "boolean", "json"]).default("string"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlatformSetting = typeof platformSettings.$inferSelect;
export type InsertPlatformSetting = typeof platformSettings.$inferInsert;

/**
 * Notifications table for broadcast notifications and alerts.
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: mysqlEnum("type", ["broadcast", "alert", "system", "order_update"]).default("broadcast"),
  targetAudience: mysqlEnum("targetAudience", ["all_users", "restaurants", "riders", "customers", "admins"]).default("all_users"),
  status: mysqlEnum("status", ["draft", "scheduled", "sent", "failed"]).default("draft"),
  sentAt: timestamp("sentAt"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Notification read status tracking.
 */
export const notificationReadStatus = mysqlTable("notificationReadStatus", {
  id: int("id").autoincrement().primaryKey(),
  notificationId: int("notificationId").notNull(),
  userId: int("userId").notNull(),
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NotificationReadStatus = typeof notificationReadStatus.$inferSelect;
export type InsertNotificationReadStatus = typeof notificationReadStatus.$inferInsert;

/**
 * Delivery history for riders.
 */
export const deliveryHistory = mysqlTable("deliveryHistory", {
  id: int("id").autoincrement().primaryKey(),
  riderId: int("riderId").notNull(),
  orderId: int("orderId").notNull(),
  pickupLocation: text("pickupLocation"),
  deliveryLocation: text("deliveryLocation"),
  distance: decimal("distance", { precision: 8, scale: 2 }), // in km
  duration: int("duration"), // in minutes
  rating: int("rating"), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DeliveryHistory = typeof deliveryHistory.$inferSelect;
export type InsertDeliveryHistory = typeof deliveryHistory.$inferInsert;

/**
 * Admin audit log for tracking admin actions.
 */
export const auditLog = mysqlTable("auditLog", {
  id: int("id").autoincrement().primaryKey(),
  adminId: int("adminId").notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: int("entityId"),
  details: json("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type InsertAuditLog = typeof auditLog.$inferInsert;
