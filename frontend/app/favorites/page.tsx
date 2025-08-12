"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import HouseCards from "../components/HouseCards";
import Link from "next/link";
import type { House } from "@/app/components/HouseCards";

interface FavoriteHouse extends House {
  favoritedAt?: string; // When it was favorited
}

interface FavoriteResponse {
  _id: string;
  clerk_id: string;
  house_id: House;
  createdAt: string;
  updatedAt: string;
}

const FavoritesPage = () => {
  const { userId, getToken } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;

    try {
      console.log("=== Fetching favorites for user:", userId);
      const token = await getToken();
      const response = await axios.get(`${DATABASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("=== Favorites response:", response.data);

      // Transform the response to match our House type
      const favoritedHouses = response.data.map(
        (favorite: FavoriteResponse) => ({
          ...favorite.house_id,
          isFavorited: true,
          favoritedAt: favorite.createdAt,
        })
      );

      setFavorites(favoritedHouses);
      setError(null);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setError("Failed to load your favorite houses");
    } finally {
      setLoading(false);
    }
  }, [userId, getToken, DATABASE_URL]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleFavoriteToggle = async (
    houseId: string,
    isFavorited: boolean
  ) => {
    if (!userId) return;

    try {
      const token = await getToken();

      if (isFavorited) {
        // Add to favorites
        await axios.post(
          `${DATABASE_URL}/api/favorites`,
          { house_id: houseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Remove from favorites
        await axios.delete(`${DATABASE_URL}/api/favorites/${houseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove from local state
        setFavorites((prev) => prev.filter((house) => house._id !== houseId));
      }
    } catch (error) {
      console.error("Error updating favorite:", error);
      // You might want to show a toast notification here
      alert("Failed to update favorite. Please try again.");
    }
  };

  if (!userId) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-4">
            Please sign in to view your favorite houses.
          </p>
          <Link href="/houses" className="btn btn-primary">
            Browse Houses
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchFavorites} className="btn btn-primary mr-4">
            Try Again
          </button>
          <Link href="/houses" className="btn btn-outline">
            Browse Houses
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Your Favorite Homes</h1>
          <p className="text-gray-600">
            Houses you&apos;ve saved for later consideration
          </p>
        </div>

        {/* Favorites Count */}
        {favorites.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-2">❤️</span>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {favorites.length} Favorite Home
                    {favorites.length !== 1 ? "s" : ""}
                  </h3>
                  <p className="text-sm text-blue-700">
                    Click the heart again to remove from favorites
                  </p>
                </div>
              </div>
              <button
                onClick={fetchFavorites}
                className="btn btn-sm btn-outline"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-8">
              <span className="text-6xl">💔</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">
              No favorites yet
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start browsing houses and click the heart icon to save your
              favorites here for easy access later.
            </p>
            <Link href="/houses" className="btn btn-primary">
              🏠 Browse Houses
            </Link>
          </div>
        ) : (
          /* Favorites Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((house) => (
              <div key={house._id} className="relative">
                <HouseCards
                  house={house}
                  onFavoriteToggle={handleFavoriteToggle}
                />
                {/* Favorited Date Badge */}
                {house.favoritedAt && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    ❤️ {new Date(house.favoritedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {favorites.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">
                Ready to take the next step?
              </h3>
              <div className="flex justify-center gap-4">
                <Link href="/houses" className="btn btn-outline">
                  🔍 Browse More Houses
                </Link>
                <Link href="/messages" className="btn btn-primary">
                  💬 Contact Sellers
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FavoritesPage;
