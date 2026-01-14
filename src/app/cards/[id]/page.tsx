"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { GET_CARD } from "@/lib/graphql";
import { CardDetail } from "@/components/product/CardDetail";
import { Button } from "@/components/ui/button";
import { AddToCartToast } from "@/components/cart/AddToCartToast";
import { ArrowLeft } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart";
import { CardCondition } from "@prisma/client";

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

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params.id as string;
  const addItem = useCartStore((state) => state.addItem);

  const { data, loading, error } = useQuery<{ card: any }>(GET_CARD, {
    variables: { id: cardId },
  });

  const handleAddToCart = (inventoryId: string, quantity: number) => {
    if (!data?.card) return;

    const inventoryItem = data.card.inventoryItems.find(
      (item: any) => item.id === inventoryId
    );

    if (!inventoryItem) return;

    const condition = conditionDisplayMap[inventoryItem.condition as CardCondition];

    addItem(
      {
        cardInventoryId: inventoryId,
        cardId: data.card.id,
        name: data.card.name,
        imageUrl: data.card.imageUrl,
        condition,
        price: inventoryItem.price,
      },
      quantity
    );


    // Show success toast
    toast.success(
      <AddToCartToast
        cardId={data.card.id}
        name={data.card.name}
        imageUrl={data.card.imageUrl}
        condition={condition}
        quantity={quantity}
        price={inventoryItem.price}
        cardSet={data.card.set}
        cardNumber={data.card.cardNumber}
      />,
      {
        duration: 4000,
        position: "bottom-right",
      }
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-10 bg-muted rounded w-32 mb-4 animate-pulse"></div>
        </div>
        <div className="rounded-2xl border bg-card overflow-hidden animate-pulse">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="aspect-[2/3] bg-muted rounded-xl"></div>
              <div className="flex gap-2">
                <div className="h-9 bg-muted rounded flex-1"></div>
                <div className="h-9 bg-muted rounded flex-1"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded"></div>
                ))}
              </div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Card
          </h1>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!data?.card) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Card Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The card you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/shop" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>

      <CardDetail card={data.card} onAddToCart={handleAddToCart} />
    </div>
  );
}
