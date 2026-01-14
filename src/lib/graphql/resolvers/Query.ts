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

interface SortInput {
  field: "NAME" | "CARD_NUMBER" | "PRICE" | "RARITY" | "SET";
  order: "ASC" | "DESC";
}

// Set order for sorting
const SET_ORDER = {
  "Base Set": 1,
  "Jungle": 2,
  "Fossil": 3,
  "Base Set 2": 4,
  "Team Rocket": 5,
};

export const Query = {
  // Card queries
  cards: async (
    _: any,
    {
      filter,
      sort,
      limit = 20,
      offset = 0,
    }: { filter?: CardFilter; sort?: SortInput; limit: number; offset: number },
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

    // Get all cards without sorting first (we'll sort in memory)
    const cards = await prisma.card.findMany({
      where,
      include: {
        inventoryItems: true,
      },
    });

    // Sort the cards
    let sortedCards = [...cards];

    if (sort) {
      sortedCards.sort((a, b) => {
        let comparison = 0;

        switch (sort.field) {
          case "NAME":
            comparison = a.name.localeCompare(b.name);
            break;
          case "CARD_NUMBER": {
            // Parse card numbers (handle formats like "1/102", "10/102", etc.)
            const aNum = parseInt(a.cardNumber?.split("/")[0] || "0");
            const bNum = parseInt(b.cardNumber?.split("/")[0] || "0");
            comparison = aNum - bNum;
            break;
          }
          case "PRICE": {
            // Get minimum price from inventory items
            const aMinPrice = Math.min(
              ...a.inventoryItems.map((item) => item.price),
              Infinity
            );
            const bMinPrice = Math.min(
              ...b.inventoryItems.map((item) => item.price),
              Infinity
            );
            comparison = aMinPrice - bMinPrice;
            break;
          }
          case "RARITY":
            comparison = a.rarity.localeCompare(b.rarity);
            break;
          case "SET": {
            const aSetOrder = (SET_ORDER as any)[a.set] || 999;
            const bSetOrder = (SET_ORDER as any)[b.set] || 999;
            comparison = aSetOrder - bSetOrder;
            break;
          }
        }

        return sort.order === "DESC" ? -comparison : comparison;
      });
    } else {
      // Default sort: by set order, then by card number
      sortedCards.sort((a, b) => {
        // First sort by set
        const aSetOrder = (SET_ORDER as any)[a.set] || 999;
        const bSetOrder = (SET_ORDER as any)[b.set] || 999;
        if (aSetOrder !== bSetOrder) {
          return aSetOrder - bSetOrder;
        }

        // Then sort by card number
        const aNum = parseInt(a.cardNumber?.split("/")[0] || "0");
        const bNum = parseInt(b.cardNumber?.split("/")[0] || "0");
        return aNum - bNum;
      });
    }

    // Apply pagination after sorting
    return sortedCards.slice(offset, offset + limit);
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
