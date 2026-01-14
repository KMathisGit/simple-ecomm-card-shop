"use client";

import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "./CartItem";
import { useCartStore } from "@/lib/stores/cart";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, totalItems, totalPrice, clearCart } = useCartStore();
  const itemCount = totalItems();
  const total = totalPrice();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col px-4 pb-4">
        <SheetHeader className="py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart
              {itemCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add some cards to get started!
            </p>
            <SheetClose asChild>
              <Button asChild>
                <Link href="/shop">Browse Cards</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              {items.map((item) => (
                <CartItem key={item.cardInventoryId} item={item} />
              ))}
            </div>

                <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>

            {/* Cart Summary */}
            <div className="pt-4 space-y-4">
              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <SheetClose asChild>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </SheetClose>
                <div className="flex gap-2">
                  <SheetClose asChild>
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                  </SheetClose>
              
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
