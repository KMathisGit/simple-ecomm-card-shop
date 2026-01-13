"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CardCondition } from "@prisma/client";

interface CardInventory {
  id: string;
  condition: CardCondition;
  price: number;
  quantity: number;
}

interface ConditionSelectorProps {
  inventoryItems: CardInventory[];
  selectedCondition?: CardCondition;
  onConditionSelect: (condition: CardCondition) => void;
  onAddToCart?: (inventoryId: string, quantity: number) => void;
}

const conditionDescriptions = {
  MINT: "Perfect condition, no visible flaws",
  NEAR_MINT: "Excellent condition with minor imperfections",
  EXCELLENT: "Very good condition with slight wear",
  GOOD: "Good condition with noticeable wear",
  LIGHT_PLAYED: "Lightly played with moderate wear",
  PLAYED: "Played condition with significant wear",
  POOR: "Poor condition with heavy wear",
};

const conditionColors = {
  MINT: "cursor-pointer bg-green-100 text-green-800 border-1 border-green-300 ",
  NEAR_MINT:
    "cursor-pointer bg-blue-100 text-blue-800 border-1 border-blue-300 ",
  EXCELLENT:
    "cursor-pointer bg-yellow-100 text-yellow-800 border-1 border-yellow-300 ",
  GOOD: "cursor-pointer bg-orange-100 text-orange-800 border-1 border-orange-300 ",
  LIGHT_PLAYED:
    "cursor-pointer bg-red-100 text-red-800 border-1 border-red-300 ",
  PLAYED: "cursor-pointer bg-red-200 text-red-900 border-1 border-red-400 ",
  POOR: "cursor-pointer bg-gray-100 text-gray-800 border-1 border-gray-300 ",
};

export function ConditionSelector({
  inventoryItems,
  selectedCondition,
  onConditionSelect,
  onAddToCart,
}: ConditionSelectorProps) {
  const [localSelected, setLocalSelected] = useState<CardCondition | null>(
    selectedCondition || null
  );
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const selected = selectedCondition || localSelected;
  const selectedItem = inventoryItems.find(
    (item) => item.condition === selected
  );

  const handleConditionClick = (condition: CardCondition) => {
    setLocalSelected(condition);
    onConditionSelect(condition);
  };

  const handleQuantityChange = (inventoryId: string, quantity: number) => {
    const item = inventoryItems.find((item) => item.id === inventoryId);
    const maxQty = item?.quantity || 0;
    setQuantities((prev) => ({
      ...prev,
      [inventoryId]: Math.max(0, Math.min(quantity, maxQty)),
    }));
  };

  const handleAddToCart = () => {
    if (selectedItem && onAddToCart) {
      const quantity = quantities[selectedItem.id] || 1;
      if (quantity > 0) {
        onAddToCart(selectedItem.id, quantity);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Condition</h3>

      {/* Horizontal Button Row */}
      <div className="flex flex-wrap gap-2">
        {inventoryItems.map((item) => (
          <Badge
            key={item.id}
            className={`${conditionColors[item.condition]} px-6`}
            data-selected={selected === item.condition}
            onClick={() => handleConditionClick(item.condition)}
          >
            <div className="flex flex-col items-start gap-1">
              <span className="font-semibold">
                {item.condition.replace("_", " ")}
              </span>
              <span className="text-xs">${item.price.toFixed(2)}</span>
            </div>
          </Badge>
        ))}
      </div>

      {/* Selected Condition Details */}
      {selected && selectedItem && (
        <div className="border rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg">
                {selected.replace("_", " ")}
              </h4>
              <Badge
                variant={selectedItem.quantity > 0 ? "default" : "secondary"}
              >
                {selectedItem.quantity > 0
                  ? `${selectedItem.quantity} available`
                  : "Out of Stock"}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {conditionDescriptions[selected]}
            </p>

            <div className="text-2xl font-bold text-green-600">
              ${selectedItem.price.toFixed(2)}
            </div>
          </div>

          {selectedItem.quantity > 0 && (
            <>
              <Separator />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(
                        selectedItem.id,
                        (quantities[selectedItem.id] || 1) - 1
                      )
                    }
                    disabled={(quantities[selectedItem.id] || 1) <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-semibold">
                    {quantities[selectedItem.id] || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleQuantityChange(
                        selectedItem.id,
                        (quantities[selectedItem.id] || 1) + 1
                      )
                    }
                    disabled={
                      (quantities[selectedItem.id] || 1) >=
                      selectedItem.quantity
                    }
                  >
                    +
                  </Button>
                </div>

                <Button onClick={handleAddToCart} className="flex-1">
                  Add to Cart - $
                  {(
                    selectedItem.price * (quantities[selectedItem.id] || 1)
                  ).toFixed(2)}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {!selected && (
        <div className="text-center py-8 text-muted-foreground">
          Select a condition to view details and add to cart
        </div>
      )}
    </div>
  );
}
