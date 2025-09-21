import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

export type House = {
  user_id?: string;
  _id: string;
  clerk_id?: string; // Optional for user houses
  image: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  address: string;
  postal_code: string;
  year_built: number;
  isFavorited?: boolean;
  createdAt?: string;
};

type HouseCardsProps = {
  house: House;
  onFavoriteToggle?: (houseId: string, isFavorite: boolean) => void; // callback for favorite toggle
};

const HouseCards = ({ house, onFavoriteToggle }: HouseCardsProps) => {
  const { userId, getToken } = useAuth();
  const [isFavorited, setIsFavorited] = useState(house.isFavorited || false);
  const [isLoading, setIsLoading] = useState(false);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const isOwner =
    userId && (house.clerk_id === userId || house.user_id === userId);

  // Update local state when house prop changes
  useEffect(() => {
    setIsFavorited(house.isFavorited || false);
  }, [house.isFavorited]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert("Please log in to favorite houses.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await getToken();
      const newFavoriteStatus = !isFavorited;

      // Optimistically update UI
      setIsFavorited(newFavoriteStatus);

      if (newFavoriteStatus) {
        // Add to favorites
        await axios.post(
          `${BACKEND_URL}/api/favorites`,
          { house_id: house._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ House added to favorites:", house._id);
      } else {
        // Remove from favorites
        await axios.delete(`${BACKEND_URL}/api/favorites/${house._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("❌ House removed from favorites:", house._id);
      }

      // Call parent callback if provided
      if (onFavoriteToggle) {
        onFavoriteToggle(house._id, newFavoriteStatus);
      }
    } catch (error) {
      // Revert on error
      setIsFavorited(!isFavorited);
      console.error("Error updating favorite status:", error);
      alert("Failed to update favorite status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="card bg-base-100 w-96 shadow-sm relative">
        {/* ✅ ADD: Favorite Heart Button */}
        {!isOwner && userId && (
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white/80 hover:scale-110"
            }`}
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            {/* Heart Icon */}
            <svg
              className={`w-6 h-6 transition-colors duration-200 ${
                isFavorited
                  ? "text-red-500 fill-current"
                  : "text-red-500 stroke-current fill-none hover:text-red-500"
              }`}
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </button>
        )}

        {/* House Image and Details */}
        <Link href={`/houses/${house._id}`}>
          <Image
            src={house.image}
            width={500}
            height={500}
            alt="House Image"
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
        </Link>

        <div className="card-body">
          <h2 className="card-title">
            {house.city}, {house.state}
          </h2>
          <p>${Math.round(house.price)}</p>
          <p>
            {house.bedrooms} {house.bedrooms === 1 ? "Bedroom" : "Bedrooms"} |{" "}
            {house.bathrooms} {house.bathrooms === 1 ? "Bathroom" : "Bathrooms"}{" "}
            | {house.square_feet} sqft
          </p>
          <p>
            {house.address}, {house.postal_code}
          </p>
          <p>Year Built: {house.year_built}</p>
        </div>
      </div>
    </div>
  );
};

export default HouseCards;
