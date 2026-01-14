"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConditionBadge } from "@/components/product/ConditionBadge";
import { CartItem as CartItemType, useCartStore } from "@/lib/stores/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex gap-3 py-4 border-b last:border-b-0">
      {/* Image - Clickable */}
      <Link href={`/cards/${item.cardId}`} className="flex-shrink-0 hover:opacity-80 transition-opacity">
        <div className="w-16 h-22 relative rounded-md overflow-hidden bg-muted">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
              Img
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/cards/${item.cardId}`} className="hover:text-primary transition-colors block">
          <h4 className="font-semibold text-sm truncate">{item.name}</h4>
        </Link>
        <div className="mt-1">
          <ConditionBadge condition={item.condition} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() =>
                updateQuantity(item.cardInventoryId, item.quantity - 1)
              }
            >
              -
            </Button>
            <span className="text-sm font-medium w-6 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() =>
                updateQuantity(item.cardInventoryId, item.quantity + 1)
              }
            >
              +
            </Button>
          </div>
          <div className="text-sm font-semibold text-primary">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
        onClick={() => removeItem(item.cardInventoryId)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
