"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Heart, Share2, Package, Info } from "lucide-react";

// Mock card data
const mockCard = {
  id: "1",
  name: "Charizard",
  imageUrl: "/placeholder-card.png",
  rarity: "Rare Holo",
  set: "Base Set",
  cardNumber: "4/102",
  description:
    "A legendary Fire/Flying type Pokemon. Spits fire that is hot enough to melt boulders. Known to cause forest fires unintentionally.",
  inventoryItems: [
    { id: "1", condition: "Mint", price: 1200.0, quantity: 2 },
    { id: "2", condition: "Near Mint", price: 950.0, quantity: 5 },
    { id: "3", condition: "Excellent", price: 700.0, quantity: 8 },
    { id: "4", condition: "Good", price: 450.0, quantity: 12 },
    { id: "5", condition: "Light Played", price: 300.0, quantity: 15 },
    { id: "6", condition: "Played", price: 180.0, quantity: 0 },
    { id: "7", condition: "Poor", price: 100.0, quantity: 3 },
  ],
};

export default function CardDetailsVariantsPage() {
  const [variant, setVariant] = useState("split-hero");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Card Details Page Variants</h1>
          <p className="text-muted-foreground mb-6">
            Layouts for the individual card details/view page. These designs
            balance visual appeal, information hierarchy, and purchasing
            functionality with a clean, professional aesthetic.
          </p>

          {/* Variant Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select Variant:</label>
            <Select value={variant} onValueChange={setVariant}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="split-hero">
                  Variant 1: Split Hero Layout
                </SelectItem>
                <SelectItem value="card-first">
                  Variant 2: Card First with Info Panel
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Variant Display */}
        {variant === "split-hero" && <SplitHeroVariant card={mockCard} />}
        {variant === "card-first" && <CardFirstVariant card={mockCard} />}
      </div>
    </div>
  );
}

// Variant 1: Split Hero Layout
function SplitHeroVariant({ card }: { card: typeof mockCard }) {
  const [selectedCondition, setSelectedCondition] = useState(card.inventoryItems[1]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 p-8">
        {/* Left: Image */}
        <div className="space-y-4">
          <div className="aspect-[2/3] bg-muted rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">Card Image</span>
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
              <Badge className="text-base px-3 py-1">{card.rarity}</Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>{card.set}</span>
              <span>•</span>
              <span>#{card.cardNumber}</span>
            </div>
          </div>

          <p className="text-muted-foreground">{card.description}</p>

          <Separator />

          {/* Condition Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Select Condition</label>
            <div className="grid grid-cols-2 gap-2">
              {card.inventoryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCondition(item)}
                  disabled={item.quantity === 0}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedCondition.id === item.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  } ${item.quantity === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="font-semibold text-sm">{item.condition}</div>
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
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(selectedCondition.quantity, quantity + 1))}
                  disabled={quantity >= selectedCondition.quantity}
                >
                  +
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full" disabled={selectedCondition.quantity === 0}>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - ${(selectedCondition.price * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Variant 2: Card First with Info Panel
function CardFirstVariant({ card }: { card: typeof mockCard }) {
  const [selectedCondition, setSelectedCondition] = useState(card.inventoryItems[1]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6">
      {/* Hero Section with Image */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="grid md:grid-cols-[400px,1fr] gap-6 p-6">
          {/* Large Card Image */}
          <div className="aspect-[2/3] bg-muted rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">Card Image</span>
          </div>

          {/* Header Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="text-base px-3 py-1">{card.rarity}</Badge>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>
                      {card.inventoryItems.reduce((sum, item) => sum + item.quantity, 0)} total in stock
                    </span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-1">{card.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{card.set}</span>
                  <span>•</span>
                  <span>#{card.cardNumber}</span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {card.description}
              </p>

              {/* Card Info Pills */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                  <Info className="h-4 w-4 text-primary" />
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Set</div>
                    <div className="font-medium">{card.set}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                  <Info className="h-4 w-4 text-primary" />
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Card #</div>
                    <div className="font-medium">#{card.cardNumber}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share Card
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Panel */}
      <div className="rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-bold mb-4">Purchase Options</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Condition Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold">Condition & Pricing</label>
            <div className="space-y-2">
              {card.inventoryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCondition(item)}
                  disabled={item.quantity === 0}
                  className={`w-full p-3 rounded-lg border-2 flex items-center justify-between transition-all ${
                    selectedCondition.id === item.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  } ${item.quantity === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-sm">{item.condition}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity > 0 ? `${item.quantity} available` : "Out of stock"}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Purchase Summary */}
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Selected Condition
                </div>
                <div className="text-lg font-bold">{selectedCondition.condition}</div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-1">Unit Price</div>
                <div className="text-2xl font-bold text-primary">
                  ${selectedCondition.price.toFixed(2)}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-2">Quantity</div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="flex-1 text-center font-bold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      setQuantity(Math.min(selectedCondition.quantity, quantity + 1))
                    }
                    disabled={quantity >= selectedCondition.quantity}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm text-muted-foreground mb-1">Total</div>
                <div className="text-3xl font-bold text-primary">
                  ${(selectedCondition.price * quantity).toFixed(2)}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={selectedCondition.quantity === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              {selectedCondition.quantity > 0 ? (
                <>
                  <Package className="h-3 w-3 inline mr-1" />
                  {selectedCondition.quantity} available • Ships within 1-2 business days
                </>
              ) : (
                "Out of stock"
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
