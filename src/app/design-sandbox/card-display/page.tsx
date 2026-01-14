"use client";

import { CardRow, CardRowList } from "@/components/product/CardRow";
import { Card } from "@/types/graphql";
import { CardCondition } from "@prisma/client";

// Mock card data with inventory
const mockCards: Card[] = [
  {
    id: "1",
    name: "Charizard",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "4/102",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventoryItems: [
      { id: "1", cardId: "1", condition: "MINT" as CardCondition, price: 1200.0, quantity: 2, createdAt: "", updatedAt: "", card: {} as Card },
      { id: "2", cardId: "1", condition: "NEAR_MINT" as CardCondition, price: 950.0, quantity: 5, createdAt: "", updatedAt: "", card: {} as Card },
      { id: "3", cardId: "1", condition: "EXCELLENT" as CardCondition, price: 700.0, quantity: 8, createdAt: "", updatedAt: "", card: {} as Card },
    ],
  },
  {
    id: "2",
    name: "Blastoise",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "2/102",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventoryItems: [
      { id: "4", cardId: "2", condition: "NEAR_MINT" as CardCondition, price: 500.0, quantity: 3, createdAt: "", updatedAt: "", card: {} as Card },
      { id: "5", cardId: "2", condition: "GOOD" as CardCondition, price: 250.0, quantity: 7, createdAt: "", updatedAt: "", card: {} as Card },
    ],
  },
  {
    id: "3",
    name: "Venusaur",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "15/102",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventoryItems: [
      { id: "6", cardId: "3", condition: "EXCELLENT" as CardCondition, price: 300.0, quantity: 4, createdAt: "", updatedAt: "", card: {} as Card },
      { id: "7", cardId: "3", condition: "LIGHT_PLAYED" as CardCondition, price: 150.0, quantity: 6, createdAt: "", updatedAt: "", card: {} as Card },
    ],
  },
  {
    id: "4",
    name: "Pikachu",
    imageUrl: "/placeholder-card.png",
    rarity: "Common",
    set: "Base Set",
    cardNumber: "58/102",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventoryItems: [
      { id: "8", cardId: "4", condition: "MINT" as CardCondition, price: 25.0, quantity: 15, createdAt: "", updatedAt: "", card: {} as Card },
      { id: "9", cardId: "4", condition: "NEAR_MINT" as CardCondition, price: 15.0, quantity: 30, createdAt: "", updatedAt: "", card: {} as Card },
    ],
  },
  {
    id: "5",
    name: "Mewtwo",
    imageUrl: "/placeholder-card.png",
    rarity: "Rare Holo",
    set: "Base Set",
    cardNumber: "10/102",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    inventoryItems: [
      { id: "10", cardId: "5", condition: "PLAYED" as CardCondition, price: 80.0, quantity: 0, createdAt: "", updatedAt: "", card: {} as Card },
    ],
  },
];

export default function CardDisplayPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Card Row Component</h1>
          <p className="text-muted-foreground mb-6">
            Compact row-based layout for displaying Pokemon cards in search
            results and listing pages. Features scannable information with
            stock count, conditions available, and starting price.
          </p>
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Production Component
          </div>
        </div>

        {/* Single CardRow Example */}
        <div className="space-y-8">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Single Card Row</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import: <code className="bg-muted px-2 py-1 rounded">{"import { CardRow } from '@/components/product/CardRow'"}</code>
            </p>
            <CardRow card={mockCards[0]} />
          </div>

          {/* CardRowList Example */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Card Row List</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import: <code className="bg-muted px-2 py-1 rounded">{"import { CardRowList } from '@/components/product/CardRow'"}</code>
            </p>
            <CardRowList cards={mockCards} />
          </div>

          {/* Loading State */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Loading State</h3>
            <CardRowList cards={[]} loading={true} />
          </div>

          {/* Empty State */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Empty State</h3>
            <CardRowList cards={[]} emptyMessage="No cards found matching your search" />
          </div>

          {/* Usage Example */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { CardRowList } from '@/components/product/CardRow';

function SearchResults({ cards, loading }) {
  return (
    <CardRowList
      cards={cards}
      loading={loading}
      emptyMessage="No cards found"
    />
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
