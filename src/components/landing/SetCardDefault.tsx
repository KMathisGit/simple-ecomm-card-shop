"use client";

import Image from "next/image";
import Link from "next/link";
import { CardSet } from "@/lib/data/sets";
import { cn } from "@/lib/utils";

interface SetCardDefaultProps {
  set: CardSet;
  showAllPacks?: boolean;
  className?: string;
}

/**
 * Default set card component for displaying sets in a grid.
 * Used in the "Shop by Set" section with multiple packs display option.
 */
export function SetCardDefault({
  set,
  showAllPacks = false,
  className,
}: SetCardDefaultProps) {
  const searchUrl = `/search?set=${encodeURIComponent(set.name)}`;
  const displayPacks = showAllPacks ? set.boosterPacks : [set.boosterPacks[0]];

  return (
    <Link
      href={searchUrl}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl hover:border-primary/50",
        className
      )}
    >
      {/* Pack Display */}
      <div className="relative flex items-center justify-center p-6 bg-gradient-to-b from-muted/50 to-transparent">
        {showAllPacks ? (
          <div className="flex items-center justify-center">
            {displayPacks.map((pack, index) => (
              <div
                key={pack.name}
                className="relative h-40 w-28 transition-all duration-500 group-hover:scale-105"
                style={{
                  marginLeft: index > 0 ? "-1.5rem" : 0,
                  zIndex: displayPacks.length - index,
                  transform: `rotate(${(index - Math.floor(displayPacks.length / 2)) * 6}deg)`,
                }}
              >
                <Image
                  src={pack.image}
                  alt={pack.name}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="112px"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative h-48 w-32 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2">
            <Image
              src={set.boosterPacks[0].image}
              alt={set.name}
              fill
              className="object-contain drop-shadow-lg"
              sizes="128px"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 border-t">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-lg">{set.name}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {set.releaseYear}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {set.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {set.totalCards} cards
          </span>
          <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
            Shop Now
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
