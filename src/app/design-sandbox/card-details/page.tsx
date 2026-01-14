"use client";

import { CardDetail } from "@/components/product/CardDetail";
import { CardCondition } from "@prisma/client";

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
    { id: "1", condition: "MINT" as CardCondition, price: 1200.0, quantity: 2 },
    { id: "2", condition: "NEAR_MINT" as CardCondition, price: 950.0, quantity: 5 },
    { id: "3", condition: "EXCELLENT" as CardCondition, price: 700.0, quantity: 8 },
    { id: "4", condition: "GOOD" as CardCondition, price: 450.0, quantity: 12 },
    { id: "5", condition: "LIGHT_PLAYED" as CardCondition, price: 300.0, quantity: 15 },
    { id: "6", condition: "PLAYED" as CardCondition, price: 180.0, quantity: 0 },
    { id: "7", condition: "POOR" as CardCondition, price: 100.0, quantity: 3 },
  ],
};

export default function CardDetailsPage() {
  const handleAddToCart = (inventoryId: string, quantity: number) => {
    console.log(`Adding ${quantity} of inventory item ${inventoryId} to cart`);
    alert(`Added ${quantity} item(s) to cart!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Card Detail Component</h1>
          <p className="text-muted-foreground mb-6">
            Split hero layout for the individual card details/view page.
            Features card image on the left, details and purchase options on
            the right. Clean, professional aesthetic with condition selection
            and add to cart functionality.
          </p>
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Production Component
          </div>
        </div>

        {/* CardDetail Example */}
        <div className="space-y-8">
          <div className="rounded-xl border bg-muted/30 p-6">
            <h3 className="text-lg font-semibold mb-4">Card Detail View</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Import: <code className="bg-muted px-2 py-1 rounded">{"import { CardDetail } from '@/components/product/CardDetail'"}</code>
            </p>
            <CardDetail card={mockCard} onAddToCart={handleAddToCart} />
          </div>

          {/* Usage Example */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Usage Example</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`import { CardDetail } from '@/components/product/CardDetail';

function CardPage({ card }) {
  const handleAddToCart = (inventoryId, quantity) => {
    // Add to cart logic
    console.log(\`Adding \${quantity} items to cart\`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CardDetail
        card={card}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}`}
            </pre>
          </div>

          {/* Features */}
          <div className="rounded-xl border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Split layout with card image and details side by side
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Condition-based inventory selection grid
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Dynamic pricing based on selected condition
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Quantity selector with stock limit
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Wishlist and Share action buttons
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Out of stock handling for unavailable conditions
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Uses RarityBadge and ConditionBadge components
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
