"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "Unknown";

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>

        {/* Order Details Card */}
        <div className="rounded-xl border bg-card p-6 mb-6 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-semibold">Order Details</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-mono font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="text-green-600 font-medium">Confirmed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-medium">3-5 Business Days</span>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 mb-6 text-left">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Demo Mode:</strong> This is a simulated order confirmation.
            No actual order has been placed and no payment has been processed.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/orders">View Order History</Link>
          </Button>
          <Button asChild>
            <Link href="/shop" className="flex items-center gap-2">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Email Notice */}
        <p className="text-xs text-muted-foreground mt-8">
          A confirmation email will be sent to your email address (in a real
          implementation).
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 text-center">Loading...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
