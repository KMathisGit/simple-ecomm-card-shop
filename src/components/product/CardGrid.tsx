"use client";

import { CardItem } from "./CardItem";
import { CardCondition } from "@prisma/client";

interface CardInventory {
  id: string;
  condition: CardCondition;
  price: number;
  quantity: number;
}

interface Card {
  id: string;
  name: string;
  imageUrl: string;
  rarity: string;
  set: string;
  cardNumber?: string;
  inventoryItems: CardInventory[];
}

interface CardGridProps {
  cards: Card[];
  loading?: boolean;
  emptyMessage?: string;
}

export function CardGrid({
  cards,
  loading = false,
  emptyMessage = "No cards found",
}: CardGridProps) {
  if (loading) {
    return (
      <div className="border rounded-lg">
        <div className="grid grid-cols-[100px_1fr_120px_100px_120px] gap-4 p-4 border-b bg-muted/50 font-semibold text-sm">
          <div>Image</div>
          <div>Card Details</div>
          <div className="text-right">Price Range</div>
          <div className="text-center">Stock</div>
          <div className="text-right">Conditions</div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[100px_1fr_120px_100px_120px] gap-4 p-4 border-b animate-pulse"
          >
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[100px_1fr_120px_120px] gap-4 p-4 border-b bg-muted/50 font-semibold text-sm">
        <div>Image</div>
        <div>Card Details</div>
        <div className="text-right">Price Range</div>
        <div className="text-right">Conditions</div>
      </div>
      {/* Table Rows */}
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
