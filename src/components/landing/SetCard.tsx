"use client";

import Image from "next/image";
import Link from "next/link";
import { CardSet } from "@/lib/data/sets";
import { cn } from "@/lib/utils";

interface SetCardProps {
  set: CardSet;
  variant?: "default" | "compact" | "featured" | "minimal";
  showAllPacks?: boolean;
  className?: string;
}

/**
 * A clickable card component that displays a Pokemon card set
 * with its booster pack images. Navigates to filtered search results.
 */
export function SetCard({
  set,
  variant = "default",
  showAllPacks = false,
  className,
}: SetCardProps) {
  const searchUrl = `/search?set=${encodeURIComponent(set.name)}`;
  const displayPacks = showAllPacks ? set.boosterPacks : [set.boosterPacks[0]];

  if (variant === "minimal") {
    return (
      <Link
        href={searchUrl}
        className={cn(
          "group relative block overflow-hidden rounded-xl transition-all duration-300 hover:scale-105",
          className
        )}
      >
        <div className="relative aspect-[3/4] w-full">
          <Image
            src={set.boosterPacks[0].image}
            alt={set.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
          <h3 className="font-bold text-white">{set.name}</h3>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={searchUrl}
        className={cn(
          "group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all duration-300 hover:border-primary hover:shadow-lg",
          className
        )}
      >
        <div className="relative h-20 w-14 flex-shrink-0">
          <Image
            src={set.boosterPacks[0].image}
            alt={set.name}
            fill
            className="object-contain"
            sizes="56px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate">{set.name}</h3>
          <p className="text-sm text-muted-foreground">
            {set.totalCards} cards
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={searchUrl}
        className={cn(
          "group relative block overflow-hidden rounded-2xl",
          className
        )}
        style={{
          background: `linear-gradient(135deg, ${set.gradientFrom}, ${set.gradientTo})`,
        }}
      >
        <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
          {/* Pack Images */}
          <div className="relative flex items-center justify-center">
            {set.boosterPacks.slice(0, 3).map((pack, index) => (
              <div
                key={pack.name}
                className="relative h-48 w-32 md:h-64 md:w-44 transition-transform duration-500 group-hover:scale-105"
                style={{
                  marginLeft: index > 0 ? "-2rem" : 0,
                  zIndex: set.boosterPacks.length - index,
                  transform: `rotate(${(index - 1) * 8}deg)`,
                }}
              >
                <Image
                  src={pack.image}
                  alt={pack.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 128px, 176px"
                />
              </div>
            ))}
          </div>

          {/* Content */}
          <div className={`flex-1 text-center md:text-left text-[${set.accentColor}]`}>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider mb-3">
              {set.releaseYear}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold mb-2">{set.name}</h3>
            <p className=" text-sm md:text-base max-w-md mb-4">
              {set.description}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
              Browse {set.totalCards} Cards
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
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
