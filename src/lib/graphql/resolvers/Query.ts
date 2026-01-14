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
              ...a.inventoryItems.map((item) => item.price.toNumber()),
              Infinity
            );
            const bMinPrice = Math.min(
              ...b.inventoryItems.map((item) => item.price.toNumber()),
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
    const paginatedCards = sortedCards.slice(offset, offset + limit);

    // Serialize DateTime fields to ISO strings
    return paginatedCards.map((card) => ({
      ...card,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    }));

  },

  card: async (_: any, { id }: { id: string }, { prisma }: GraphQLContext) => {
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        inventoryItems: true,
      },
    });

    if (!card) return null;

    // Serialize DateTime fields to ISO strings
    return {
      ...card,
      createdAt: card.createdAt.toISOString(),
      updatedAt: card.updatedAt.toISOString(),
    };
  },

  cardInventory: async (
    _: any,
    { cardId }: { cardId: string },
    { prisma }: GraphQLContext
  ) => {
    const inventories = await prisma.cardInventory.findMany({
      where: { cardId },
      include: {
        card: true,
      },
      orderBy: { price: "asc" },
    });

    // Serialize DateTime fields to ISO strings
    return inventories.map((inventory) => ({
      ...inventory,
      createdAt: inventory.createdAt.toISOString(),
      updatedAt: inventory.updatedAt.toISOString(),
      card: {
        ...inventory.card,
        createdAt: inventory.card.createdAt.toISOString(),
        updatedAt: inventory.card.updatedAt.toISOString(),
      },
    }));
  },

  // User queries
  me: async (_: any, __: any, { user, prisma }: GraphQLContext) => {
    if (!user) return null;

    const userData = await prisma.user.findUnique({
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

    if (!userData) return null;

    // Serialize DateTime fields to ISO strings
    return {
      ...userData,
      createdAt: userData.createdAt.toISOString(),
      updatedAt: userData.updatedAt.toISOString(),
      orders: userData.orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      })),
    };
  },

  // Order queries
  orders: async (
    _: any,
    { limit = 20, offset = 0 }: { limit: number; offset: number },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user) throw new Error("Not authenticated");

    const orders = await prisma.order.findMany({
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

    // Serialize DateTime fields to ISO strings
    return orders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));
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

    // Serialize DateTime fields to ISO strings
    return {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };
  },

  // Admin queries
  allUsers: async (
    _: any,
    { limit = 20, offset = 0 }: { limit: number; offset: number },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    });

    // Serialize DateTime fields to ISO strings
    return users.map((u) => ({
      ...u,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
    }));
  },

  allOrders: async (
    _: any,
    { limit = 20, offset = 0 }: { limit: number; offset: number },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    const orders = await prisma.order.findMany({
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

    // Serialize DateTime fields to ISO strings
    return orders.map((order) => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      user: {
        ...order.user,
        createdAt: order.user.createdAt.toISOString(),
        updatedAt: order.user.updatedAt.toISOString(),
      },
    }));
  },
};
