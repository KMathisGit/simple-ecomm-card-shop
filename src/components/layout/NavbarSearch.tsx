"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLazyQuery } from "@apollo/client/react";
import Image from "next/image";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GET_CARDS } from "@/lib/graphql/queries";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  imageUrl: string;
  set: string;
  rarity: string;
}

interface GetCardsResponse {
  cards: SearchResult[];
}

interface NavbarSearchProps {
  onResultClick?: () => void;
  className?: string;
}

export function NavbarSearch({ onResultClick, className }: NavbarSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const [searchCards, { loading, data }] = useLazyQuery<GetCardsResponse>(GET_CARDS);

  // Update results when data changes
  useEffect(() => {
    if (data?.cards) {
      setResults(data.cards);
    }
  }, [data]);

  // Debounced search
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (searchQuery.length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      debounceRef.current = setTimeout(() => {
        searchCards({
          variables: {
            filter: { name: searchQuery },
            limit: 6,
          },
        });
        setIsOpen(true);
      }, 300);
    },
    [searchCards]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle form submit (navigate to search page)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onResultClick?.();
    }
  };

  // Handle result click
  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    onResultClick?.();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search cards..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
            className="pl-10 pr-4"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-auto rounded-md border bg-popover shadow-lg"
        >
          {results.length > 0 ? (
            <>
              <div className="p-2">
                {results.map((card) => (
                  <Link
                    key={card.id}
                    href={`/cards/${card.id}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 rounded-md p-2 hover:bg-muted transition-colors"
                  >
                    <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded bg-muted">
                      <Image
                        src={card.imageUrl}
                        alt={card.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">
                        {card.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {card.set} &bull; {card.rarity}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="border-t p-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full rounded-md p-2 text-center text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  View all results for &quot;{query}&quot;
                </button>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No cards found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
