import { CardCondition } from "@prisma/client";

export interface Card {
  id: string;
  name: string;
  imageUrl: string;
  rarity: string;
  set: string;
  cardNumber?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  inventoryItems: CardInventory[];
}

export interface CardInventory {
  id: string;
  cardId: string;
  condition: CardCondition;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  card: Card;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  orders: Order[];
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  cardInventoryId: string;
  quantity: number;
  priceAtPurchase: number;
  order: Order;
  cardInventory: CardInventory;
}

export interface CardFilter {
  name?: string;
  set?: string;
  rarity?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: CardCondition;
  inStock?: boolean;
}

export interface GetCardsResponse {
  cards: Card[];
}

export interface GetCardResponse {
  card: Card | null;
}

export interface GetCardInventoryResponse {
  cardInventory: CardInventory[];
}
