"use client";

import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { GET_ORDER } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConditionBadge } from "@/components/product/ConditionBadge";
import { ArrowLeft, Package, CheckCircle2, Truck, MapPin } from "lucide-react";
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

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  cardInventory: {
    id: string;
    condition: CardCondition;
    card: {
      id: string;
      name: string;
      imageUrl: string;
      rarity: string;
      set: string;
    };
  };
}

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data, loading, error } = useQuery<{ order: Order }>(GET_ORDER, {
    variables: { id: orderId },
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-muted rounded w-32"></div>
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">
          {error?.message || "The order you're looking for doesn't exist."}
        </p>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const order = data.order;
  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/orders" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Completed
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Order Timeline (Mock) */}
          <div className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold mb-4">Order Status</h2>
            <div className="relative">
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-green-500" />
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Order Placed</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Processing</div>
                    <div className="text-sm text-muted-foreground">
                      Your order is being prepared
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Truck className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Shipped</div>
                    <div className="text-sm text-muted-foreground">
                      Your order is on its way
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Delivered</div>
                    <div className="text-sm text-muted-foreground">
                      Order completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="p-4 bg-muted/30">
              <h2 className="font-semibold">
                Items ({order.orderItems.length})
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Link href={`/cards/${item.cardInventory.card.id}`}>
                    <div className="w-16 h-22 relative rounded overflow-hidden bg-muted flex-shrink-0">
                      {item.cardInventory.card.imageUrl ? (
                        <Image
                          src={item.cardInventory.card.imageUrl}
                          alt={item.cardInventory.card.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          Img
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/cards/${item.cardInventory.card.id}`}>
                      <h4 className="font-medium hover:text-primary transition-colors">
                        {item.cardInventory.card.name}
                      </h4>
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <ConditionBadge
                        condition={conditionDisplayMap[item.cardInventory.condition]}
                      />
                      <span className="text-sm text-muted-foreground">
                        {item.cardInventory.card.set}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      ${item.priceAtPurchase.toFixed(2)} x {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <div className="rounded-xl border bg-card p-6 sticky top-20">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <h3 className="font-medium text-sm">Shipping Address</h3>
              <div className="text-sm text-muted-foreground">
                <p>John Doe</p>
                <p>123 Main Street</p>
                <p>San Francisco, CA 94102</p>
                <p>United States</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <h3 className="font-medium text-sm">Payment Method</h3>
              <div className="text-sm text-muted-foreground">
                <p>Visa ending in 4242</p>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/shop">Order Again</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
