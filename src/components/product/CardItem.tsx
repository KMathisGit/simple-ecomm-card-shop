"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardCondition } from "@prisma/client";

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
  MINT: "bg-green-100 text-green-800",
  NEAR_MINT: "bg-blue-100 text-blue-800",
  EXCELLENT: "bg-yellow-100 text-yellow-800",
  GOOD: "bg-orange-100 text-orange-800",
  LIGHT_PLAYED: "bg-red-100 text-red-800",
  PLAYED: "bg-red-200 text-red-900",
  POOR: "bg-gray-100 text-gray-800",
};

const rarityColors = {
  Common: "bg-gray-100 text-gray-800",
  Uncommon: "bg-blue-100 text-blue-800",
  Rare: "bg-purple-100 text-purple-800",
  "Ultra Rare": "bg-red-100 text-red-800",
  "Secret Rare": "bg-yellow-100 text-yellow-800",
  "1st Edition": "bg-green-100 text-green-800",
};

export function CardItem({ card }: CardItemProps) {
  const lowestPrice = Math.min(
    ...card.inventoryItems.map((item) => item.price)
  );
  const highestPrice = Math.max(
    ...card.inventoryItems.map((item) => item.price)
  );
  const totalStock = card.inventoryItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const getRarityColor = (rarity: string) => {
    return (
      rarityColors[rarity as keyof typeof rarityColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  return (
    <Link
      href={`/cards/${card.id}`}
      className="grid grid-cols-[100px_1fr_120px_120px] gap-4 items-center p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer"
    >
      {/* Card Image */}
      <div className="relative h-32 rounded-sm overflow-hidden bg-gray-100 shrink-0">
        <Image
          src={card.imageUrl}
          alt={card.name}
          fill
          className="h-full"
          sizes="120px"
        />
      </div>

      {/* Card Info */}
      <div className="space-y-1">
        <h3 className="font-semibold text-base leading-tight">{card.name}</h3>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {card.set} {card.cardNumber && `#${card.cardNumber}`}
          </p>
          <Badge
            variant="secondary"
            className={`${getRarityColor(card.rarity)} text-xs`}
          >
            {card.rarity}
          </Badge>
        </div>
      </div>

      {/* Price Range */}
      <div className="flex items-center justify-end">
        <div className="font-semibold text-lg">
          {`$${lowestPrice.toFixed(2)} - $${highestPrice.toFixed(2)}`}
        </div>
      </div>

      {/* Conditions Available */}
      <div className="flex flex-col items-end gap-0.5">
        {card.inventoryItems
          .filter((i) => i.quantity > 0)
          .slice(0, 4)
          .map((item) => (
            <Badge
              key={item.id}
              variant="outline"
              className={`text-xs block ${conditionColors[item.condition]}`}
            >
              {item.condition.replace("_", " ")}
            </Badge>
          ))}
        {card.inventoryItems.filter((i) => i.quantity > 0).length > 4 && (
          <Badge variant="outline" className="text-xs block">
            +{card.inventoryItems.filter((i) => i.quantity > 0).length - 4}
          </Badge>
        )}
      </div>
    </Link>
  );
}
