import { GraphQLContext } from "../context";
import { CardCondition, UserRole } from "@prisma/client";

interface CardFilter {
  name?: string;
  set?: string;
  rarity?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: CardCondition;
  inStock?: boolean;
}

export const Query = {
  // Card queries
  cards: async (
    _: any,
    {
      filter,
      limit = 20,
      offset = 0,
    }: { filter?: CardFilter; limit: number; offset: number },
    { prisma }: GraphQLContext
  ) => {
    const where: any = {};

    if (filter) {
      if (filter.name) {
        where.name = { contains: filter.name, mode: "insensitive" };
      }
      if (filter.set) {
        where.set = { equals: filter.set, mode: "insensitive" };
      }
      if (filter.rarity) {
        where.rarity = { contains: filter.rarity, mode: "insensitive" };
      }

      // Filter by inventory conditions
      if (
        filter.minPrice ||
        filter.maxPrice ||
        filter.condition ||
        filter.inStock !== undefined
      ) {
        where.inventoryItems = {
          some: {
            ...(filter.condition && { condition: filter.condition }),
            ...(filter.minPrice && { price: { gte: filter.minPrice } }),
            ...(filter.maxPrice && { price: { lte: filter.maxPrice } }),
            ...(filter.inStock && { quantity: { gt: 0 } }),
          },
        };
      }
    }

    return prisma.card.findMany({
      where,
      include: {
        inventoryItems: true,
      },
      take: limit,
      skip: offset,
      orderBy: { name: "asc" },
    });
  },

  card: async (_: any, { id }: { id: string }, { prisma }: GraphQLContext) => {
    return prisma.card.findUnique({
      where: { id },
      include: {
        inventoryItems: true,
      },
    });
  },

  cardInventory: async (
    _: any,
    { cardId }: { cardId: string },
    { prisma }: GraphQLContext
  ) => {
    return prisma.cardInventory.findMany({
      where: { cardId },
      include: {
        card: true,
      },
      orderBy: { price: "asc" },
    });
  },

  // User queries
  me: async (_: any, __: any, { user, prisma }: GraphQLContext) => {
    if (!user) return null;

    return prisma.user.findUnique({
      where: { id: user.id },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                cardInventory: {
                  include: {
                    card: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  // Order queries
  orders: async (
    _: any,
    { limit = 20, offset = 0 }: { limit: number; offset: number },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user) throw new Error("Not authenticated");

    return prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: {
          include: {
            cardInventory: {
              include: {
                card: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },

  order: async (
    _: any,
    { id }: { id: string },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user) throw new Error("Not authenticated");

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            cardInventory: {
              include: {
                card: true,
              },
            },
          },
        },
      },
    });

    if (!order || order.userId !== user.id) return null;

    return order;
  },

  // Admin queries
  allUsers: async (
    _: any,
    { limit = 20, offset = 0 }: { limit: number; offset: number },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    return prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },

  allOrders: async (
    _: any,
    { limit = 20, offset = 0 }: { limit: number; offset: number },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    return prisma.order.findMany({
      include: {
        user: true,
        orderItems: {
          include: {
            cardInventory: {
              include: {
                card: true,
              },
            },
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });
  },
};
