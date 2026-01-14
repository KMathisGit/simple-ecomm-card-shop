"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Star, Circle } from "lucide-react";

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
  const [variant, setVariant] = useState("solid-pills");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Badge Variants</h1>
          <p className="text-muted-foreground mb-6">
            Different approaches to displaying Rarity and Condition badges
            throughout the application. These badges need to be scannable,
            attractive, and clearly communicate card status.
          </p>

          {/* Variant Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Select Variant:</label>
            <Select value={variant} onValueChange={setVariant}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid-pills">
                  Variant 1: Solid Color Pills
                </SelectItem>
                <SelectItem value="outlined-subtle">
                  Variant 2: Outlined with Subtle Background
                </SelectItem>
                <SelectItem value="icon-badges">
                  Variant 3: Icon + Text Badges
                </SelectItem>
                <SelectItem value="minimal-text">
                  Variant 4: Minimalist Text Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Variant Display */}
        {variant === "solid-pills" && <SolidPillsVariant />}
        {variant === "outlined-subtle" && <OutlinedSubtleVariant />}
        {variant === "icon-badges" && <IconBadgesVariant />}
        {variant === "minimal-text" && <MinimalTextVariant />}
      </div>
    </div>
  );
}

// Variant 1: Solid Color Pills
function SolidPillsVariant() {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-slate-600 text-white";
      case "Uncommon":
        return "bg-green-600 text-white";
      case "Rare":
        return "bg-blue-600 text-white";
      case "Rare Holo":
        return "bg-purple-600 text-white";
      case "Ultra Rare":
        return "bg-amber-600 text-white";
      case "Secret Rare":
        return "bg-rose-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Mint":
        return "bg-emerald-600 text-white";
      case "Near Mint":
        return "bg-green-600 text-white";
      case "Excellent":
        return "bg-lime-600 text-white";
      case "Good":
        return "bg-yellow-600 text-white";
      case "Light Played":
        return "bg-orange-600 text-white";
      case "Played":
        return "bg-red-600 text-white";
      case "Poor":
        return "bg-slate-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="space-y-8">
      {/* Rarity Badges */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Rarity Badges</h3>
        <div className="flex flex-wrap gap-3">
          {rarities.map((rarity) => (
            <span
              key={rarity}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRarityColor(
                rarity
              )}`}
            >
              {rarity}
            </span>
          ))}
        </div>
      </div>

      {/* Condition Badges */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Condition Badges</h3>
        <div className="flex flex-wrap gap-3">
          {conditions.map((condition) => (
            <span
              key={condition}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(
                condition
              )}`}
            >
              {condition}
            </span>
          ))}
        </div>
      </div>

      {/* In Context Example */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">In Context</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Charizard</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getRarityColor("Rare Holo")}`}>
            Rare Holo
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getConditionColor("Near Mint")}`}>
            Near Mint
          </span>
        </div>
      </div>
    </div>
  );
}

// Variant 2: Outlined with Subtle Background
function OutlinedSubtleVariant() {
  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300";
      case "Uncommon":
        return "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950 dark:text-green-300";
      case "Rare":
        return "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-300";
      case "Rare Holo":
        return "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-600 dark:bg-purple-950 dark:text-purple-300";
      case "Ultra Rare":
        return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-950 dark:text-amber-300";
      case "Secret Rare":
        return "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-600 dark:bg-rose-950 dark:text-rose-300";
      default:
        return "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getConditionStyle = (condition: string) => {
    switch (condition) {
      case "Mint":
        return "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950 dark:text-emerald-300";
      case "Near Mint":
        return "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950 dark:text-green-300";
      case "Excellent":
        return "border-lime-300 bg-lime-50 text-lime-700 dark:border-lime-600 dark:bg-lime-950 dark:text-lime-300";
      case "Good":
        return "border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-950 dark:text-yellow-300";
      case "Light Played":
        return "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-600 dark:bg-orange-950 dark:text-orange-300";
      case "Played":
        return "border-red-300 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-950 dark:text-red-300";
      case "Poor":
        return "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300";
      default:
        return "border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-8">
      {/* Rarity Badges */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Rarity Badges</h3>
        <div className="flex flex-wrap gap-3">
          {rarities.map((rarity) => (
            <span
              key={rarity}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRarityStyle(
                rarity
              )}`}
            >
              {rarity}
            </span>
          ))}
        </div>
      </div>

      {/* Condition Badges */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Condition Badges</h3>
        <div className="flex flex-wrap gap-3">
          {conditions.map((condition) => (
            <span
              key={condition}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getConditionStyle(
                condition
              )}`}
            >
              {condition}
            </span>
          ))}
        </div>
      </div>

      {/* In Context Example */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">In Context</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Charizard</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRarityStyle("Rare Holo")}`}>
            Rare Holo
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getConditionStyle("Near Mint")}`}>
            Near Mint
          </span>
        </div>
      </div>
    </div>
  );
}

