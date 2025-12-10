'use client';

import { CardItem } from './CardItem';

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

export function CardGrid({ cards, loading = false, emptyMessage = "No cards found" }: CardGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
}