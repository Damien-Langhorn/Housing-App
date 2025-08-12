"use client";

import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import HouseCards from "../components/HouseCards";
import { useAuth } from "@clerk/nextjs";
import type { House } from "@/app/components/HouseCards";

type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "bedrooms"
  | "bathrooms"
  | "sqft-large"
  | "sqft-small";

const Page = () => {
  const { userId } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  // ✅ ADD: Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteHouses, setFavoriteHouses] = useState<Set<string>>(new Set());
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  useEffect(() => {
    const getHouses = async () => {
      try {
        console.log("Fetching houses from:", DATABASE_URL);
        const res = await axios.get(`${DATABASE_URL}/api/houses`);
        console.log("Houses fetched successfully:", res.data);
        setHouses(res.data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      } finally {
        setLoading(false);
      }
    };
    getHouses();
  }, [DATABASE_URL]);

  const sortHouses = (
    housesToSort: House[],
    sortOption: SortOption
  ): House[] => {
    const sorted = [...housesToSort];

    switch (sortOption) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );

      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );

      case "price-low":
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));

      case "price-high":
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));

      case "bedrooms":
        return sorted.sort(
          (a, b) => Number(b.bedrooms || 0) - Number(a.bedrooms || 0)
        );

      case "bathrooms":
        return sorted.sort(
          (a, b) => Number(b.bathrooms || 0) - Number(a.bathrooms || 0)
        );

      case "sqft-large":
        return sorted.sort(
          (a, b) => Number(b.square_feet || 0) - Number(a.square_feet || 0)
        );

      case "sqft-small":
        return sorted.sort(
          (a, b) => Number(a.square_feet || 0) - Number(b.square_feet || 0)
        );

      default:
        return sorted;
    }
  };

  // ✅ ADD: Search function
  const searchHouses = (housesToSearch: House[], query: string): House[] => {
    if (!query.trim()) return housesToSearch;

    const lowercaseQuery = query.toLowerCase();

    return housesToSearch.filter((house) => {
      const searchableText = [
        house.address,
        house.city,
        house.state,
        house.postal_code,
        house.price.toString(),
        house.bedrooms?.toString(),
        house.bathrooms?.toString(),
        house.square_feet?.toString(),
        house.year_built?.toString(),
      ]
        .filter(Boolean) // Remove undefined/null values
        .join(" ")
        .toLowerCase();

      return searchableText.includes(lowercaseQuery);
    });
  };

  // ✅ UPDATED: Filter by user, then search, then sort
  const filteredHouses = useMemo(() => {
    return userId
      ? houses.filter((house) => house.clerk_id !== userId)
      : houses;
  }, [houses, userId]);

  // ✅ ADD: Apply search to filtered houses
  const searchedHouses = useMemo(() => {
    return searchHouses(filteredHouses, searchQuery);
  }, [filteredHouses, searchQuery]);

  // ✅ UPDATED: Sort the searched houses
  const sortedHouses = useMemo(() => {
    return sortHouses(searchedHouses, sortBy);
  }, [searchedHouses, sortBy]);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
  };

  // ✅ ADD: Search handler - this will connect to your existing search bar
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // ✅ ADD: Clear search function
  const clearSearch = () => {
    setSearchQuery("");
  };

  // ✅ ADD: Handle favorite toggle from child component
  const handleFavoriteToggle = (houseId: string, isFavorited: boolean) => {
    setFavoriteHouses((prev) => {
      const newFavorites = new Set(prev);
      if (isFavorited) {
        newFavorites.add(houseId);
      } else {
        newFavorites.delete(houseId);
      }
      return newFavorites;
    });
  };

  return (
    <section className="min-h-screen overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        {/* Add search input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by address, city, state, price, bedrooms..."
            className="input input-bordered w-full"
          />
        </div>

        {/* ✅ ADD: Search results info (optional) */}
        {searchQuery && (
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              {sortedHouses.length === 0 ? (
                <span className="text-red-600"></span>
              ) : (
                <span>
                  Found {sortedHouses.length} home
                  {sortedHouses.length !== 1 ? "s" : ""} matching &ldquo;
                  {searchQuery}&rdquo;
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="ml-2 text-accent hover:text-neutral-content underline text-sm"
                    >
                      Clear search
                    </button>
                  )}
                </span>
              )}
            </p>
          </div>
        )}

        {!loading && sortedHouses.length > 0 && (
          <div className="flex items-center justify-between bg-neutral p-4 rounded-lg mb-8">
            <div>
              <h3 className="font-semibold">
                {sortedHouses.length} Home{sortedHouses.length !== 1 ? "s" : ""}{" "}
                {searchQuery ? "Found" : "Available"}
              </h3>
              <p className="text-sm">
                {searchQuery
                  ? `Matching "${searchQuery}"`
                  : "Find your perfect home"}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-sm font-medium">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="border rounded-lg px-4 py-2 text-sm focus:ring-2"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="bedrooms">Most Bedrooms</option>
                <option value="bathrooms">Most Bathrooms</option>
                <option value="sqft-large">Largest First</option>
                <option value="sqft-small">Smallest First</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading amazing homes...</p>
          </div>
        ) : sortedHouses.length === 0 ? (
          <div className="text-center py-16">
            {searchQuery ? (
              <>
                <p className="text-gray-500 text-lg">
                  No homes found matching &ldquo;{searchQuery}&rdquo;
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try different keywords or{" "}
                  <button
                    onClick={clearSearch}
                    className="text-accent hover:text-neutral-content underline"
                  >
                    clear your search
                  </button>
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-500 text-lg">
                  No homes available at the moment.
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Check back later for new listings!
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
            {sortedHouses.map((house) => (
              <HouseCards
                key={house._id}
                house={{
                  ...house,
                  isFavorited: favoriteHouses.has(house._id), // ✅ ADD: Pass favorite status
                }}
                onFavoriteToggle={handleFavoriteToggle} // ✅ ADD: Pass callback
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
