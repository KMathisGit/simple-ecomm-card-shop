import { cn } from "@/lib/utils";

export type Condition =
  | "Mint"
  | "Near Mint"
  | "Excellent"
  | "Good"
  | "Light Played"
  | "Played"
  | "Poor";

interface ConditionBadgeProps {
  condition: Condition | string;
  className?: string;
}

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

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getConditionStyle(condition),
        className
      )}
    >
      {condition}
    </span>
  );
}
