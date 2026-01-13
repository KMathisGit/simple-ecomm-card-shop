"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GET_CARD } from "@/lib/graphql";
import { CardDetail } from "@/components/product/CardDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params.id as string;

  const { data, loading, error } = useQuery<{ card: any }>(GET_CARD, {
    variables: { id: cardId },
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <Link href="/">Back to Shop</Link>
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
            <Link href="/">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        <h1 className="text-3xl font-bold">{data.card.name}</h1>
        <p className="text-muted-foreground">
          {data.card.set} {data.card.cardNumber && `#${data.card.cardNumber}`}
        </p>
      </div>

      <CardDetail
        card={data.card}
        onAddToCart={(inventoryId, quantity) => {
          // TODO: Implement cart functionality
          console.log("Add to cart:", { inventoryId, quantity });
        }}
      />
    </div>
  );
}
