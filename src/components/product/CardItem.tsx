'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardCondition } from '@/generated/prisma';

interface CardInventory {
  id: string;
  condition: CardCondition;
  price: number;
  quantity: number;
}

interface CardItemProps {
  card: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: string;
    set: string;
    cardNumber?: string;
    inventoryItems: CardInventory[];
  };
}

const conditionColors = {
  MINT: 'bg-green-100 text-green-800',
  NEAR_MINT: 'bg-blue-100 text-blue-800',
  EXCELLENT: 'bg-yellow-100 text-yellow-800',
  GOOD: 'bg-orange-100 text-orange-800',
  LIGHT_PLAYED: 'bg-red-100 text-red-800',
  PLAYED: 'bg-red-200 text-red-900',
  POOR: 'bg-gray-100 text-gray-800',
};

const rarityColors = {
  Common: 'bg-gray-100 text-gray-800',
  Uncommon: 'bg-blue-100 text-blue-800',
  Rare: 'bg-purple-100 text-purple-800',
  'Ultra Rare': 'bg-red-100 text-red-800',
  'Secret Rare': 'bg-yellow-100 text-yellow-800',
  '1st Edition': 'bg-green-100 text-green-800',
};

export function CardItem({ card }: CardItemProps) {
  const lowestPrice = Math.min(...card.inventoryItems.map(item => item.price));
  const highestPrice = Math.max(...card.inventoryItems.map(item => item.price));
  const totalStock = card.inventoryItems.reduce((sum, item) => sum + item.quantity, 0);

  const getRarityColor = (rarity: string) => {
    return rarityColors[rarity as keyof typeof rarityColors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-[3/4] relative mb-4 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={card.imageUrl}
            alt={card.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {card.name}
            </h3>
            <Badge variant="secondary" className={getRarityColor(card.rarity)}>
              {card.rarity}
            </Badge>
          </div>

          <p className="text-xs text-muted-foreground">
            {card.set} {card.cardNumber && `#${card.cardNumber}`}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold text-green-600">
                ${lowestPrice.toFixed(2)}
              </span>
              {lowestPrice !== highestPrice && (
                <span className="text-muted-foreground ml-1">
                  - ${highestPrice.toFixed(2)}
                </span>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {totalStock} in stock
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1">
            {card.inventoryItems.slice(0, 3).map((item) => (
              <Badge
                key={item.id}
                variant="outline"
                className={`text-xs ${conditionColors[item.condition]}`}
              >
                {item.condition.replace('_', ' ')}: ${item.price.toFixed(2)}
              </Badge>
            ))}
            {card.inventoryItems.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{card.inventoryItems.length - 3} more
              </Badge>
            )}
          </div>

          <Button asChild className="w-full" size="sm">
            <Link href={`/cards/${card.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}