"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/types/graphql";
import { RarityBadge } from "./RarityBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardRowProps {
  card: Card;
  className?: string;
}

// Helper to calculate total stock from inventory items
function getTotalStock(card: Card): number {
  return card.inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
}

// Helper to get number of conditions available
function getConditionsAvailable(card: Card): number {
  return card.inventoryItems.filter((item) => item.quantity > 0).length;
}

// Helper to get the minimum price
function getMinPrice(card: Card): number | null {
  const availableItems = card.inventoryItems.filter((item) => item.quantity > 0);
  if (availableItems.length === 0) return null;
  return Math.min(...availableItems.map((item) => item.price));
}

export function CardRow({ card, className }: CardRowProps) {
  const totalStock = getTotalStock(card);
  const conditionsAvailable = getConditionsAvailable(card);
  const minPrice = getMinPrice(card);
  const inStock = totalStock > 0;

  return (
    <div
      className={cn(
        "group rounded-lg border bg-card p-3 hover:shadow-md transition-all",
        className
      )}
    >
      <div className="flex gap-3 items-center">
        {/* Small Thumbnail */}
        <Link href={`/cards/${card.id}`} className="flex-shrink-0">
          <div className="w-14 aspect-[2/3] bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground relative overflow-hidden">
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              "Img"
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-[8px] font-medium">OOS</span>
              </div>
            )}
          </div>
        </Link>

        {/* Info Section */}
        <div className="flex-1 min-w-0 flex items-center gap-3">
          {/* Name & Set */}
          <div className="flex-1 min-w-0">
            <Link href={`/cards/${card.id}`}>
              <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                {card.name}
              </h3>
            </Link>
            <div className="text-xs text-muted-foreground">
              {card.set} {card.cardNumber && `• #${card.cardNumber}`}
            </div>
          </div>

          {/* Info Pills */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <RarityBadge rarity={card.rarity} />
            <Badge variant="outline" className="text-xs">
              {totalStock > 0 ? `${totalStock} stock` : "0 stock"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {conditionsAvailable} cond.
            </Badge>
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0 min-w-[80px]">
            {minPrice !== null ? (
              <div className="text-lg font-bold text-primary">
                ${minPrice.toFixed(2)}+
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">N/A</div>
            )}
          </div>

          {/* Action */}
          <Button asChild size="sm" variant="ghost" className="flex-shrink-0">
            <Link href={`/cards/${card.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// CardRowList component for displaying multiple cards
interface CardRowListProps {
  cards: Card[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function CardRowList({
  cards,
  loading,
  emptyMessage = "No cards found",
  className,
}: CardRowListProps) {
  if (loading) {
    return (
      <div className={cn("space-y-2", className)}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border bg-card p-3 animate-pulse"
          >
            <div className="flex gap-3 items-center">
              <div className="w-14 aspect-[2/3] bg-muted rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
              <div className="h-6 bg-muted rounded w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {cards.map((card) => (
        <CardRow key={card.id} card={card} />
      ))}
    </div>
  );
}
