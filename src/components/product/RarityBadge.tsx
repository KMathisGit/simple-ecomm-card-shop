import { cn } from "@/lib/utils";

export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Rare Holo"
  | "Ultra Rare"
  | "Secret Rare";

interface RarityBadgeProps {
  rarity: Rarity | string;
  className?: string;
}

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

export function RarityBadge({ rarity, className }: RarityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getRarityStyle(rarity),
        className
      )}
    >
      {rarity}
    </span>
  );
}
