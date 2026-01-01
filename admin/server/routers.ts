import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantStatus,
  getRestaurantOrders,
  getAllRiders,
  getRiderById,
  updateRiderStatus,
  getRiderDeliveryHistory,
  getAllOrders,
  getOrderById,
  getOrderItems,
  updateOrderStatus,
  cancelOrder,
  getAllCategories,
  createCategory,
  updateCategory,
  getRestaurantMenuItems,
  updateMenuItemStatus,
  getPlatformSettings,
  updatePlatformSetting,
  createNotification,
  getNotifications,
  getDashboardStats,
  getRevenueStats,
  createAuditLog,
} from "./db";

// Mock admin user for development (no auth required)
const mockAdminUser = { id: 1, role: "admin" as const };

// Admin procedure - using publicProcedure for development (auth disabled)
const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  // Bypass auth check for development - inject mock admin user
  return next({ ctx: { ...ctx, user: mockAdminUser } });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Dashboard
  dashboard: router({
    getStats: adminProcedure.query(async () => {
      return await getDashboardStats();
    }),
    getRevenueStats: adminProcedure
      .input(z.object({ days: z.number().default(30) }))
      .query(async ({ input }) => {
        return await getRevenueStats(input.days);
      }),
  }),

  // User Management
  users: router({
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
          search: z.string().optional(),
          userType: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        return await getAllUsers(
          input.limit,
          input.offset,
          input.search,
          input.userType,
          input.isActive
        );
      }),
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getUserById(input.id);
      }),
    updateStatus: adminProcedure
      .input(z.object({ id: z.number(), isActive: z.boolean() }))
      .mutation(async ({ input, ctx }) => {
        await createAuditLog(
          ctx.user.id,
          "UPDATE_USER_STATUS",
          "user",
          input.id,
          { isActive: input.isActive }
        );
        return await updateUserStatus(input.id, input.isActive);
      }),
  }),

  // Restaurant Management
  restaurants: router({
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
          search: z.string().optional(),
          status: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        return await getAllRestaurants(
          input.limit,
          input.offset,
          input.search,
          input.status,
          input.isActive
        );
      }),
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getRestaurantById(input.id);
      }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum([
            "pending",
            "approved",
            "rejected",
            "active",
            "inactive",
          ]),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await createAuditLog(
          ctx.user.id,
          "UPDATE_RESTAURANT_STATUS",
          "restaurant",
          input.id,
          { status: input.status, isActive: input.isActive }
        );
        return await updateRestaurantStatus(
          input.id,
          input.status,
          input.isActive
        );
      }),
    getOrders: adminProcedure
      .input(
        z.object({
          restaurantId: z.number(),
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getRestaurantOrders(
          input.restaurantId,
          input.limit,
          input.offset
        );
      }),
  }),

  // Rider Management
  riders: router({
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
          search: z.string().optional(),
          status: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        return await getAllRiders(
          input.limit,
          input.offset,
          input.search,
          input.status,
          input.isActive
        );
      }),
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getRiderById(input.id);
      }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum([
            "pending",
            "approved",
            "rejected",
            "active",
            "inactive",
            "blocked",
          ]),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await createAuditLog(
          ctx.user.id,
          "UPDATE_RIDER_STATUS",
          "rider",
          input.id,
          { status: input.status, isActive: input.isActive }
        );
        return await updateRiderStatus(
          input.id,
          input.status,
          input.isActive
        );
      }),
    getDeliveryHistory: adminProcedure
      .input(
        z.object({
          riderId: z.number(),
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getRiderDeliveryHistory(
          input.riderId,
          input.limit,
          input.offset
        );
      }),
  }),

  // Order Management
  orders: router({
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
          search: z.string().optional(),
          status: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .query(async ({ input }) => {
        return await getAllOrders(
          input.limit,
          input.offset,
          input.search,
          input.status,
          input.startDate,
          input.endDate
        );
      }),
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const order = await getOrderById(input.id);
        if (!order) return null;

        const items = await getOrderItems(input.id);
        return { ...order, items };
      }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum([
            "pending",
            "confirmed",
            "preparing",
            "ready",
            "picked_up",
            "in_transit",
            "delivered",
            "cancelled",
            "refunded",
          ]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await createAuditLog(
          ctx.user.id,
          "UPDATE_ORDER_STATUS",
          "order",
          input.id,
          { status: input.status }
        );
        return await updateOrderStatus(input.id, input.status);
      }),
    cancel: adminProcedure
      .input(
        z.object({
          id: z.number(),
          reason: z.string(),
          refundAmount: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await createAuditLog(
          ctx.user.id,
          "CANCEL_ORDER",
          "order",
          input.id,
          { reason: input.reason, refundAmount: input.refundAmount }
        );
        return await cancelOrder(input.id, input.reason, input.refundAmount);
      }),
  }),

  // Category Management
  categories: router({
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().default(100),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getAllCategories(input.limit, input.offset);
      }),
    create: adminProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          icon: z.string().optional(),
          image: z.string().optional(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await createCategory(input);
        await createAuditLog(
          ctx.user.id,
          "CREATE_CATEGORY",
          "category",
          undefined,
          input
        );
        return result;
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
          image: z.string().optional(),
          isActive: z.boolean().optional(),
          displayOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        const result = await updateCategory(id, data);
        await createAuditLog(
          ctx.user.id,
          "UPDATE_CATEGORY",
          "category",
          id,
          data
        );
        return result;
      }),
  }),

  // Menu Items Management
  menuItems: router({
    getRestaurantMenu: adminProcedure
      .input(
        z.object({
          restaurantId: z.number(),
          limit: z.number().default(100),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getRestaurantMenuItems(
          input.restaurantId,
          input.limit,
          input.offset
        );
      }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "approved", "rejected"]),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        await createAuditLog(
          ctx.user.id,
          "UPDATE_MENU_ITEM_STATUS",
          "menu_item",
          id,
          data
        );
        return await updateMenuItemStatus(id, data.status, data.isActive);
      }),
  }),

  // Platform Settings
  settings: router({
    getAll: adminProcedure.query(async () => {
      return await getPlatformSettings();
    }),
    get: adminProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return await getPlatformSettings(input.key);
      }),
    update: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await createAuditLog(
          ctx.user.id,
          "UPDATE_SETTING",
          "setting",
          undefined,
          { key: input.key, value: input.value }
        );
        return await updatePlatformSetting(input.key, input.value);
      }),
  }),

  // Notifications
  notifications: router({
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getNotifications(input.limit, input.offset);
      }),
    send: adminProcedure
      .input(
        z.object({
          title: z.string(),
          content: z.string(),
          type: z.enum(["broadcast", "alert", "system", "order_update"]),
          targetAudience: z.enum([
            "all_users",
            "restaurants",
            "riders",
            "customers",
            "admins",
          ]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const result = await createNotification({
          ...input,
          status: "sent",
          sentAt: new Date(),
          createdBy: ctx.user.id,
        });
        await createAuditLog(
          ctx.user.id,
          "SEND_NOTIFICATION",
          "notification",
          undefined,
          input
        );
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
