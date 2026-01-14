"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { GET_USER_ORDERS } from "@/lib/graphql/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConditionBadge } from "@/components/product/ConditionBadge";
import { Package, ShoppingBag, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
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

export default function OrderHistoryPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { data, loading, error } = useQuery<{ orders: Order[] }>(GET_USER_ORDERS, {
    variables: { limit: 20 },
    skip: sessionStatus !== "authenticated",
  });
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const toggleOrder = (orderId: string) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Not authenticated
  if (sessionStatus === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Sign in to view orders</h1>
        <p className="text-muted-foreground mb-6">
          You need to be signed in to view your order history.
        </p>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error loading orders</h1>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No orders yet</h1>
        <p className="text-muted-foreground mb-6">
          When you make a purchase, your orders will appear here.
        </p>
        <Button asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground">
          View and track your past orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrders.has(order.id);
          const displayItems = isExpanded ? order.orderItems : order.orderItems.slice(0, 3);
          const hasMoreItems = order.orderItems.length > 3;

          return (
            <div
              key={order.id}
              className="rounded-xl border bg-card overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 bg-muted/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Order Number</div>
                    <div className="font-mono font-semibold">{order.orderNumber}</div>
                  </div>
                  <Separator orientation="vertical" className="h-10 hidden sm:block" />
                  <div className="hidden sm:block">
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-10 hidden sm:block" />
                  <div className="hidden sm:block">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-bold text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Completed
                </Badge>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="space-y-3">
                  {displayItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="w-12 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                        {item.cardInventory.card.imageUrl ? (
                          <Image
                            src={item.cardInventory.card.imageUrl}
                            alt={item.cardInventory.card.name}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {item.cardInventory.card.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <ConditionBadge
                            condition={conditionDisplayMap[item.cardInventory.condition]}
                          />
                          <span className="text-xs text-muted-foreground">
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {hasMoreItems && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-3 text-muted-foreground"
                    onClick={() => toggleOrder(order.id)}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show {order.orderItems.length - 3} more item(s)
                      </>
                    )}
                  </Button>
                )}

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="sm:hidden">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-bold text-primary">
                      ${order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="ml-auto">
                    <Link href={`/orders/${order.id}`} className="flex items-center gap-1">
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
