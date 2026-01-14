"use client";

import { RarityBadge } from "@/components/product/RarityBadge";
import { ConditionBadge } from "@/components/product/ConditionBadge";

// Mock data for display
const rarities = [
  "Common",
  "Uncommon",
  "Rare",
  "Rare Holo",
  "Ultra Rare",
  "Secret Rare",
];

const conditions = [
  "Mint",
  "Near Mint",
  "Excellent",
  "Good",
  "Light Played",
  "Played",
  "Poor",
];

export default function BadgeVariantsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Badge Components</h1>
          <p className="text-muted-foreground mb-6">
            Reusable badge components for displaying Rarity and Condition
            throughout the application. These use the outlined style with
            subtle backgrounds and rounded-full borders.
          </p>
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Production Components
          </div>
        </div>

        {/* Rarity Badges */}
        <div className="space-y-8">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Rarity Badges</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import: <code className="bg-muted px-2 py-1 rounded">{"import { RarityBadge } from '@/components/product/RarityBadge'"}</code>
            </p>
            <div className="flex flex-wrap gap-3">
              {rarities.map((rarity) => (
                <RarityBadge key={rarity} rarity={rarity} />
              ))}
            </div>
          </div>

          {/* Condition Badges */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Condition Badges</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import: <code className="bg-muted px-2 py-1 rounded">{"import { ConditionBadge } from '@/components/product/ConditionBadge'"}</code>
            </p>
            <div className="flex flex-wrap gap-3">
              {conditions.map((condition) => (
                <ConditionBadge key={condition} condition={condition} />
              ))}
            </div>
          </div>

          {/* In Context Example */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">In Context</h3>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Charizard</span>
              <RarityBadge rarity="Rare Holo" />
              <ConditionBadge condition="Near Mint" />
            </div>
          </div>

          {/* Usage Example */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { RarityBadge } from '@/components/product/RarityBadge';
import { ConditionBadge } from '@/components/product/ConditionBadge';

function CardInfo({ card }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold">{card.name}</span>
      <RarityBadge rarity={card.rarity} />
      <ConditionBadge condition={card.condition} />
    </div>
  );
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
