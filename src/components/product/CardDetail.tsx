"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RarityBadge } from "./RarityBadge";
import { ConditionBadge } from "./ConditionBadge";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
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

// Map CardCondition enum to display string
const conditionDisplayMap: Record<CardCondition, string> = {
  MINT: "Mint",
  NEAR_MINT: "Near Mint",
  EXCELLENT: "Excellent",
  GOOD: "Good",
  LIGHT_PLAYED: "Light Played",
  PLAYED: "Played",
  POOR: "Poor",
};

export function CardDetail({ card, onAddToCart }: CardDetailProps) {
  // Default to first available inventory item
  const availableItems = card.inventoryItems.filter((item) => item.quantity > 0);
  const [selectedCondition, setSelectedCondition] = useState<CardInventory | null>(
    availableItems.length > 0 ? availableItems[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (selectedCondition && onAddToCart) {
      onAddToCart(selectedCondition.id, quantity);
    }
  };

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        {/* Left: Image */}
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-full max-w-xs mx-auto md:mx-0 md:max-w-md aspect-[325/447] bg-muted rounded-xl flex items-center justify-center relative overflow-hidden">
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.name}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 300px, 400px"
              />
            ) : (
              <span className="text-muted-foreground">Card Image</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Heart className="h-4 w-4 mr-2" />
              Wishlist
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{card.name}</h1>
              <RarityBadge rarity={card.rarity} className="text-base px-3 py-1" />
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{card.set}</span>
              {card.cardNumber && (
                <>
                  <span>•</span>
                  <span>#{card.cardNumber}</span>
                </>
              )}
            </div>
          </div>

          {card.description && (
            <p className="text-muted-foreground">{card.description}</p>
          )}

          <Separator />

          {/* Condition Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Select Condition</label>
            <div className="grid grid-cols-2 gap-2">
              {card.inventoryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedCondition(item);
                    setQuantity(1); // Reset quantity when condition changes
                  }}
                  disabled={item.quantity === 0}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedCondition?.id === item.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  } ${item.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <ConditionBadge condition={conditionDisplayMap[item.condition]} />
                  </div>
                  <div className="text-lg font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.quantity > 0 ? `${item.quantity} in stock` : "Out of stock"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Quantity & Add to Cart */}
          {selectedCondition && selectedCondition.quantity > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setQuantity(Math.min(selectedCondition.quantity, quantity + 1))
                    }
                    disabled={quantity >= selectedCondition.quantity}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(selectedCondition.price * quantity).toFixed(2)}
              </Button>
            </div>
          )}

          {(!selectedCondition || selectedCondition.quantity === 0) && (
            <div className="space-y-4">
              <Button size="lg" className="w-full" disabled>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Out of Stock
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
