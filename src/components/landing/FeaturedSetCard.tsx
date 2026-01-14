"use client";

import Image from "next/image";
import Link from "next/link";
import { CardSet } from "@/lib/data/sets";
import { cn } from "@/lib/utils";

interface FeaturedSetCardProps {
  set: CardSet;
  className?: string;
}

/**
 * Featured set card component for hero sections.
 * Displays up to 3 packs in a staggered layout with gradient background.
 */
export function FeaturedSetCard({ set, className }: FeaturedSetCardProps) {
  const searchUrl = `/search?set=${encodeURIComponent(set.name)}`;

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
        <div className="flex-1 text-center md:text-left" style={{ color: set.accentColor }}>
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wider mb-3">
            {set.releaseYear}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold mb-2">{set.name}</h3>
          <p className="text-sm md:text-base max-w-md mb-4">
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
