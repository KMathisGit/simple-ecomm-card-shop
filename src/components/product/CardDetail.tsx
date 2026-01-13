"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConditionSelector } from "./ConditionSelector";
import { CardCondition } from "@prisma/client";

interface CardInventory {
  id: string;
  condition: CardCondition;
  price: number;
  quantity: number;
}

interface CardDetailProps {
  card: {
    id: string;
    name: string;
    imageUrl: string;
    rarity: string;
    set: string;
    cardNumber?: string;
    description?: string;
    inventoryItems: CardInventory[];
  };
  onAddToCart?: (inventoryId: string, quantity: number) => void;
}

const rarityColors = {
  Common: "bg-gray-100 text-gray-800",
  Uncommon: "bg-blue-100 text-blue-800",
  Rare: "bg-purple-100 text-purple-800",
  "Ultra Rare": "bg-red-100 text-red-800",
  "Secret Rare": "bg-yellow-100 text-yellow-800",
  "1st Edition": "bg-green-100 text-green-800",
};

export function CardDetail({ card, onAddToCart }: CardDetailProps) {
  const getRarityColor = (rarity: string) => {
    return (
      rarityColors[rarity as keyof typeof rarityColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const totalStock = card.inventoryItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const lowestPrice = Math.min(
    ...card.inventoryItems.map((item) => item.price)
  );
  const highestPrice = Math.max(
    ...card.inventoryItems.map((item) => item.price)
  );

  return (
    <div className="space-y-6">
      {/* Card Info and Image - Horizontal Layout */}
      <div className="flex gap-6">
        {/* Card Image - Smaller */}
        <div className="shrink-0">
          <div className="relative w-[250px] h-[350px] overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            <Image
              src={card.imageUrl}
              alt={card.name}
              fill
              className="object-cover"
              priority
              sizes="250px"
            />
          </div>
        </div>

        {/* Card Details - Vertical Stack */}
        <div className="flex-1 space-y-4">
          <div className="flex items-end gap-4">
            <h1 className="text-3xl font-bold">{card.name}</h1>
            <Badge className={`mb-1 ${getRarityColor(card.rarity)}`}>
              {card.rarity}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-sm text-muted-foreground">Set</div>
                <div className="font-medium">{card.set}</div>
              </div>
              {card.cardNumber && (
                <div>
                  <div className="text-sm text-muted-foreground">
                    Card Number
                  </div>
                  <div className="font-medium">#{card.cardNumber}</div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Total Stock</div>
                <div className="font-medium">{totalStock} cards</div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Price Range
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-600">
                  ${lowestPrice.toFixed(2)}
                </span>
                {lowestPrice !== highestPrice && (
                  <span className="text-muted-foreground">
                    to ${highestPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {card.description && (
              <>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Description
                  </div>
                  <p className="text-sm leading-relaxed">{card.description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Condition Selector */}
      <div className="border-t pt-6">
        <ConditionSelector
          inventoryItems={card.inventoryItems}
          onConditionSelect={() => {}}
          onAddToCart={onAddToCart}
        />
      </div>
    </div>
  );
}
