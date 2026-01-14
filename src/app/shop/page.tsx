"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_CARDS } from "@/lib/graphql";
import { GetCardsResponse } from "@/types/graphql";
import { CardGrid } from "@/components/product/CardGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardCondition } from "@prisma/client";
import { Search, Filter } from "lucide-react";

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<
    CardCondition | ""
  >("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const [appliedFilters, setAppliedFilters] = useState({
    name: "",
    set: "",
    condition: "" as CardCondition | "",
    minPrice: "",
    maxPrice: "",
  });

  // Convert sort option to GraphQL SortInput
  const getSortInput = () => {
    switch (sortBy) {
      case "name-asc":
        return { field: "NAME" as const, order: "ASC" as const };
      case "name-desc":
        return { field: "NAME" as const, order: "DESC" as const };
      case "price-asc":
        return { field: "PRICE" as const, order: "ASC" as const };
      case "price-desc":
        return { field: "PRICE" as const, order: "DESC" as const };
      default:
        return undefined; // Default server-side sort (by set and card number)
    }
  };

  const { data, loading, error, fetchMore, refetch } =
    useQuery<GetCardsResponse>(GET_CARDS, {
      variables: {
        filter: {
          name: searchTerm || appliedFilters.name || undefined,
          set: appliedFilters.set || undefined,
          condition: appliedFilters.condition || undefined,
          minPrice: appliedFilters.minPrice
            ? parseFloat(appliedFilters.minPrice)
            : undefined,
          maxPrice: appliedFilters.maxPrice
            ? parseFloat(appliedFilters.maxPrice)
            : undefined,
          inStock: true,
        },
        sort: getSortInput(),
        limit: 20,
        offset: 0,
      },
    });

  const applyFilters = () => {
    setAppliedFilters({
      name: searchTerm,
      set: selectedSet,
      condition: selectedCondition,
      minPrice,
      maxPrice,
    });
    refetch();
  };

  // Refetch when sort changes
  useEffect(() => {
    refetch();
  }, [sortBy, refetch]);

  console.log("ShopPage data:", data);

  const handleLoadMore = () => {
    console.log("loading more...", data?.cards);
    fetchMore({
      variables: {
        offset: data?.cards?.length || 0,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          cards: [...prev.cards, ...fetchMoreResult.cards],
        };
      },
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Cards
          </h1>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Pokémon Card Shop</h1>
        <p className="text-muted-foreground">
          Discover and collect rare Pokémon cards with condition-based pricing
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low-High)</SelectItem>
              <SelectItem value="price-desc">Price (High-Low)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50">
            <Select value={selectedSet} onValueChange={setSelectedSet}>
              <SelectTrigger>
                <SelectValue placeholder="All Sets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Base Set">Base Set</SelectItem>
                <SelectItem value="Jungle">Jungle</SelectItem>
                <SelectItem value="Fossil">Fossil</SelectItem>
                <SelectItem value="Base Set 2">Base Set 2</SelectItem>
                <SelectItem value="Team Rocket">Team Rocket</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedCondition}
              onValueChange={(value) =>
                setSelectedCondition((value as CardCondition) || "")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MINT">Mint</SelectItem>
                <SelectItem value="NEAR_MINT">Near Mint</SelectItem>
                <SelectItem value="EXCELLENT">Excellent</SelectItem>
                <SelectItem value="GOOD">Good</SelectItem>
                <SelectItem value="LIGHT_PLAYED">Light Played</SelectItem>
                <SelectItem value="PLAYED">Played</SelectItem>
                <SelectItem value="POOR">Poor</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />

            <Input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        )}

        {showFilters && (
          <div className="flex gap-2">
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedSet("");
                setSelectedCondition("");
                setMinPrice("");
                setMaxPrice("");
                setAppliedFilters({
                  name: "",
                  set: "",
                  condition: "",
                  minPrice: "",
                  maxPrice: "",
                });
                refetch();
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {(appliedFilters.name ||
          appliedFilters.set ||
          appliedFilters.condition ||
          appliedFilters.minPrice ||
          appliedFilters.maxPrice) && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Active filters:
              {appliedFilters.name && ` "${appliedFilters.name}"`}
              {appliedFilters.set && ` Set: ${appliedFilters.set}`}
              {appliedFilters.condition &&
                ` Condition: ${appliedFilters.condition.replace("_", " ")}`}
              {appliedFilters.minPrice && ` Min: $${appliedFilters.minPrice}`}
              {appliedFilters.maxPrice && ` Max: $${appliedFilters.maxPrice}`}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedSet("");
                setSelectedCondition("");
                setMinPrice("");
                setMaxPrice("");
                setAppliedFilters({
                  name: "",
                  set: "",
                  condition: "",
                  minPrice: "",
                  maxPrice: "",
                });
                refetch();
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Card Grid */}
      <CardGrid
        cards={data?.cards || []}
        loading={loading}
        emptyMessage="No cards found matching your criteria"
      />

      {/* Load More */}
      {data?.cards && data.cards.length >= 20 && (
        <div className="text-center mt-8">
          <Button onClick={handleLoadMore} disabled={loading}>
            {loading ? "Loading..." : "Load More Cards"}
          </Button>
        </div>
      )}
    </div>
  );
}
