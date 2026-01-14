"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye, Package, Star } from "lucide-react";

// Mock card data with more details
const mockCards = [
  {
    id: "1",
    name: "Charizard",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "4/102",
    minPrice: 450.0,
    maxPrice: 1200.0,
    totalStock: 27,
    conditionsAvailable: 5,
    inStock: true,
  },
  {
    id: "2",
    name: "Blastoise",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "2/102",
    minPrice: 180.0,
    maxPrice: 500.0,
    totalStock: 18,
    conditionsAvailable: 4,
    inStock: true,
  },
  {
    id: "3",
    name: "Venusaur",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "15/102",
    minPrice: 150.0,
    maxPrice: 400.0,
    totalStock: 22,
    conditionsAvailable: 5,
    inStock: true,
  },
  {
    id: "4",
    name: "Pikachu",
    imageUrl: "/placeholder-card.png",
    rarity: "Common",
    set: "Base Set",
    cardNumber: "58/102",
    minPrice: 5.0,
    maxPrice: 25.0,
    totalStock: 145,
    conditionsAvailable: 6,
    inStock: true,
  },
  {
    id: "5",
    name: "Mewtwo",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "10/102",
    minPrice: 80.0,
    maxPrice: 250.0,
    totalStock: 0,
    conditionsAvailable: 0,
    inStock: false,
  },
  {
    id: "6",
    name: "Alakazam",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "1/102",
    minPrice: 65.0,
    maxPrice: 180.0,
    totalStock: 12,
    conditionsAvailable: 3,
    inStock: true,
  },
];

export default function CardDisplayVariantsPage() {
  const [variant, setVariant] = useState("classic-row");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Card Display Variants</h1>
          <p className="text-muted-foreground mb-6">
            Table-like row layouts for displaying Pokemon cards in search results.
            Each variant focuses on scannable information with key data points
            like stock, conditions, and pricing.
          </p>

          {/* Variant Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select Variant:</label>
            <Select value={variant} onValueChange={setVariant}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic-row">
                  Variant 1: Classic Row Layout
                </SelectItem>
                <SelectItem value="compact-info">
                  Variant 2: Compact with Info Pills
                </SelectItem>
                <SelectItem value="detailed-stats">
                  Variant 3: Detailed Stats Table
                </SelectItem>
                <SelectItem value="modern-minimal">
                  Variant 4: Modern Minimal
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Variant Display */}
        {variant === "classic-row" && <ClassicRowVariant cards={mockCards} />}
        {variant === "compact-info" && <CompactInfoVariant cards={mockCards} />}
        {variant === "detailed-stats" && <DetailedStatsVariant cards={mockCards} />}
        {variant === "modern-minimal" && <ModernMinimalVariant cards={mockCards} />}
      </div>
    </div>
  );
}

// Variant 1: Classic Row Layout
function ClassicRowVariant({ cards }: { cards: typeof mockCards }) {
  return (
    <div className="space-y-3">
      {cards.map((card) => (
        <div
          key={card.id}
          className="group rounded-lg border bg-card p-4 hover:shadow-lg transition-all"
        >
          <div className="flex gap-4">
            {/* Thumbnail */}
            <Link href={`/cards/${card.id}`} className="flex-shrink-0">
              <div className="w-20 aspect-[2/3] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground relative overflow-hidden">
                <span>Image</span>
                {!card.inStock && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                )}
              </div>
            </Link>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/cards/${card.id}`}>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {card.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span>{card.set}</span>
                    <span>•</span>
                    <span>#{card.cardNumber}</span>
                    <span>•</span>
                    <Badge variant="outline" className="h-5">
                      {card.rarity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>{card.totalStock > 0 ? `${card.totalStock} in stock` : "Out of stock"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Star className="h-4 w-4" />
                      <span>{card.conditionsAvailable} conditions</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-primary">
                    ${card.minPrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    up to ${card.maxPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Button asChild size="sm">
                  <Link href={`/cards/${card.id}`}>View Details</Link>
                </Button>
                <Button size="sm" variant="outline" disabled={!card.inStock}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                {!card.inStock && (
                  <Badge variant="destructive" className="ml-auto">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Variant 2: Compact with Info Pills
function CompactInfoVariant({ cards }: { cards: typeof mockCards }) {
  return (
    <div className="space-y-2">
      {cards.map((card) => (
        <div
          key={card.id}
          className="group rounded-lg border bg-card p-3 hover:shadow-md transition-all"
        >
          <div className="flex gap-3 items-center">
            {/* Small Thumbnail */}
            <Link href={`/cards/${card.id}`} className="flex-shrink-0">
              <div className="w-14 aspect-[2/3] bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground relative overflow-hidden">
                Img
                {!card.inStock && (
                  <div className="absolute inset-0 bg-black/60" />
                )}
              </div>
            </Link>

            {/* Info Section */}
            <div className="flex-1 min-w-0 flex items-center gap-3">
              {/* Name & Set */}
              <div className="flex-1 min-w-0">
                <Link href={`/cards/${card.id}`}>
                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                    {card.name}
                  </h3>
                </Link>
                <div className="text-xs text-muted-foreground">
                  {card.set} • #{card.cardNumber}
                </div>
              </div>

              {/* Info Pills */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="secondary" className="text-xs">
                  {card.rarity}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {card.totalStock > 0 ? `${card.totalStock} stock` : "0 stock"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {card.conditionsAvailable} cond.
                </Badge>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0 min-w-[100px]">
                <div className="text-lg font-bold text-primary">
                  ${card.minPrice.toFixed(2)}+
                </div>
              </div>

              {/* Action */}
              <Button asChild size="sm" variant="ghost" className="flex-shrink-0">
                <Link href={`/cards/${card.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Variant 3: Detailed Stats Table
function DetailedStatsVariant({ cards }: { cards: typeof mockCards }) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[80px,1fr,120px,120px,140px,120px] gap-4 p-4 bg-muted/50 border-b text-sm font-semibold">
        <div>Card</div>
        <div>Details</div>
        <div>Rarity</div>
        <div className="text-center">Stock</div>
        <div className="text-center">Conditions</div>
        <div className="text-right">Price Range</div>
      </div>

      {/* Rows */}
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`group grid grid-cols-[80px,1fr,120px,120px,140px,120px] gap-4 p-4 hover:bg-muted/30 transition-colors ${
            index !== cards.length - 1 ? "border-b" : ""
          }`}
        >
          {/* Thumbnail */}
          <Link href={`/cards/${card.id}`}>
            <div className="w-full aspect-[2/3] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground relative overflow-hidden">
              <span>Img</span>
              {!card.inStock && (
                <div className="absolute inset-0 bg-black/50" />
              )}
            </div>
          </Link>

          {/* Details */}
          <div className="min-w-0">
            <Link href={`/cards/${card.id}`}>
              <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                {card.name}
              </h3>
            </Link>
            <div className="text-sm text-muted-foreground">
              {card.set} • #{card.cardNumber}
            </div>
          </div>

          {/* Rarity */}
          <div className="flex items-center">
            <Badge variant="secondary">{card.rarity}</Badge>
          </div>

          {/* Stock */}
          <div className="flex items-center justify-center">
            {card.inStock ? (
              <Badge variant="outline" className="font-mono">
                {card.totalStock}
              </Badge>
            ) : (
              <Badge variant="destructive">Out</Badge>
            )}
          </div>

          {/* Conditions */}
          <div className="flex items-center justify-center">
            <div className="text-sm font-medium">
              {card.conditionsAvailable} available
            </div>
          </div>

          {/* Price Range */}
          <div className="flex flex-col items-end justify-center">
            <div className="text-base font-bold text-primary">
              ${card.minPrice.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              to ${card.maxPrice.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Variant 4: Modern Minimal
function ModernMinimalVariant({ cards }: { cards: typeof mockCards }) {
  return (
    <div className="space-y-1">
      {cards.map((card) => (
        <Link
          key={card.id}
          href={`/cards/${card.id}`}
          className="group block"
        >
          <div className="rounded-md border bg-card p-3 hover:bg-muted/50 hover:border-primary/50 transition-all">
            <div className="flex gap-4 items-center">
              {/* Thumbnail */}
              <div className="w-16 aspect-[2/3] bg-muted rounded flex items-center justify-center text-xs text-muted-foreground relative overflow-hidden flex-shrink-0">
                <span>Img</span>
                {!card.inStock && (
                  <div className="absolute inset-0 bg-black/50" />
                )}
              </div>

              {/* Name & Meta */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold group-hover:text-primary transition-colors mb-0.5">
                  {card.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{card.set} #{card.cardNumber}</span>
                  <span>•</span>
                  <span className="font-medium">{card.rarity}</span>
                </div>
              </div>

              {/* Stock Info */}
              <div className="flex-shrink-0 text-center px-3">
                <div className="text-xs text-muted-foreground mb-0.5">Stock</div>
                <div className="font-semibold">
                  {card.inStock ? card.totalStock : <span className="text-destructive">0</span>}
                </div>
              </div>

              {/* Conditions */}
              <div className="flex-shrink-0 text-center px-3 border-l">
                <div className="text-xs text-muted-foreground mb-0.5">Options</div>
                <div className="font-semibold">{card.conditionsAvailable}</div>
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right min-w-[100px] border-l pl-4">
                <div className="text-xl font-bold text-primary">
                  ${card.minPrice.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  - ${card.maxPrice.toFixed(2)}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
