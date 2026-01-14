"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@apollo/client/react";
import { CREATE_ORDER } from "@/lib/graphql/mutations";
import { useCartStore } from "@/lib/stores/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ConditionBadge } from "@/components/product/ConditionBadge";
import { ArrowLeft, CreditCard, Lock, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const total = totalPrice();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "you@example.com",
    firstName: "John",
    lastName: "Smith",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    cardNumber: "4111 1111 1111 1111",
    expiryDate: "12/25",
    cvv: "123",
  });

  const [createOrder] = useMutation<{ createOrder?: { orderNumber: string } }>(CREATE_ORDER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order items from cart
      const orderItems = items.map((item) => ({
        cardInventoryId: item.cardInventoryId,
        quantity: item.quantity,
      }));

      // Create the order
      const { data } = await createOrder({
        variables: {
          input: {
            items: orderItems,
          },
        },
      });

      // Clear cart and redirect to success page
      clearCart();
      if(data?.createOrder) {
        router.push(`/checkout/success?orderNumber=${data.createOrder.orderNumber}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setIsProcessing(false);
      // For demo purposes, still proceed to success page
      clearCart();
      router.push(`/checkout/success?orderNumber=DEMO-${Date.now()}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some cards to your cart before checking out.
        </p>
        <Button asChild>
          <Link href="/shop">Browse Cards</Link>
        </Button>
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

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order by filling out the form below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h2 className="font-semibold">Contact Information</h2>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <h2 className="font-semibold">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="San Francisco"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="CA"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="94102"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment (Mock) */}
            <div className="rounded-xl border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Payment</h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Secure
                </div>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Demo Mode:</strong> This is a mock checkout. No real payment will be processed.
                </p>
              </div>
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Complete Order - ${total.toFixed(2)}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="rounded-xl border bg-card p-6 sticky top-20">
            <h2 className="font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.cardInventoryId} className="flex gap-3">
                  <div className="w-12 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
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
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <ConditionBadge condition={item.condition} />
                      <span className="text-xs text-muted-foreground">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
