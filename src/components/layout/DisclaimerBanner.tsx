"use client";

import { useState } from "react";
import { X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Disclaimer banner for educational/demo purposes
 * Displays at the top of the page and can be dismissed
 */
export function DisclaimerBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-amber-500/10 border-b border-amber-500/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-sm">
          <Info className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <p className="text-center text-amber-900 dark:text-amber-100">
            <strong>Educational Demo:</strong> This is a demonstration website for
            educational purposes only. This is not a real e-commerce store and no
            actual transactions will be processed.
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-auto flex-shrink-0 rounded-md p-1 hover:bg-amber-500/20 transition-colors"
            aria-label="Dismiss disclaimer"
          >
            <X className="h-4 w-4 text-amber-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
