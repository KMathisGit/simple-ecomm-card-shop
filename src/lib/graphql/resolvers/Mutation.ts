import { GraphQLContext } from "../context";
import { CardCondition } from "@/generated/prisma";

interface CreateOrderInput {
  items: OrderItemInput[];
}

interface OrderItemInput {
  cardInventoryId: string;
  quantity: number;
}

interface CreateCardInput {
  name: string;
  imageUrl: string;
  rarity: string;
  set: string;
  cardNumber?: string;
  description?: string;
}

interface UpdateCardInput {
  name?: string;
  imageUrl?: string;
  rarity?: string;
  set?: string;
  cardNumber?: string;
  description?: string;
}

interface UpdateInventoryInput {
  condition: CardCondition;
  price: number;
  quantity: number;
}

export const Mutation = {
  // Order mutations
  createOrder: async (
    _: any,
    { input }: { input: CreateOrderInput },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user) throw new Error("Not authenticated");

    // Validate items and check inventory
    const orderItems = [];
    let totalAmount = 0;

    for (const item of input.items) {
      const inventory = await prisma.cardInventory.findUnique({
        where: { id: item.cardInventoryId },
        include: { card: true },
      });

      if (!inventory)
        throw new Error(`Card inventory ${item.cardInventoryId} not found`);
      if (inventory.quantity < item.quantity) {
        throw new Error(
          `Insufficient inventory for ${inventory.card.name} (${inventory.condition})`
        );
      }

      orderItems.push({
        cardInventoryId: item.cardInventoryId,
        quantity: item.quantity,
        priceAtPurchase: inventory.price,
      });

      totalAmount += Number(inventory.price) * item.quantity;
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Create order in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          totalAmount,
          orderItems: {
            create: orderItems,
          },
        },
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
          user: true,
        },
      });

      // Update inventory quantities
      for (const item of input.items) {
        await tx.cardInventory.update({
          where: { id: item.cardInventoryId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return result;
  },

  // Admin card mutations
  createCard: async (
    _: any,
    { input }: { input: CreateCardInput },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    return prisma.card.create({
      data: input,
      include: {
        inventoryItems: true,
      },
    });
  },

  updateCard: async (
    _: any,
    { id, input }: { id: string; input: UpdateCardInput },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    return prisma.card.update({
      where: { id },
      data: input,
      include: {
        inventoryItems: true,
      },
    });
  },

  deleteCard: async (
    _: any,
    { id }: { id: string },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    // Check if card has inventory items
    const inventoryCount = await prisma.cardInventory.count({
      where: { cardId: id },
    });

    if (inventoryCount > 0) {
      throw new Error("Cannot delete card with existing inventory");
    }

    await prisma.card.delete({
      where: { id },
    });

    return true;
  },

  // Admin inventory mutations
  updateInventory: async (
    _: any,
    { cardId, input }: { cardId: string; input: UpdateInventoryInput },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    // Check if inventory item exists, create if not
    const existing = await prisma.cardInventory.findUnique({
      where: {
        cardId_condition: {
          cardId,
          condition: input.condition,
        },
      },
    });

    if (existing) {
      return prisma.cardInventory.update({
        where: { id: existing.id },
        data: {
          price: input.price,
          quantity: input.quantity,
        },
        include: {
          card: true,
        },
      });
    } else {
      return prisma.cardInventory.create({
        data: {
          cardId,
          condition: input.condition,
          price: input.price,
          quantity: input.quantity,
        },
        include: {
          card: true,
        },
      });
    }
  },

  deleteInventory: async (
    _: any,
    { id }: { id: string },
    { user, prisma }: GraphQLContext
  ) => {
    if (!user || user.role !== "ADMIN") throw new Error("Not authorized");

    // Check if inventory is used in any orders
    const orderItemCount = await prisma.orderItem.count({
      where: { cardInventoryId: id },
    });

    if (orderItemCount > 0) {
      throw new Error("Cannot delete inventory item that has been ordered");
    }

    await prisma.cardInventory.delete({
      where: { id },
    });

    return true;
  },
};
