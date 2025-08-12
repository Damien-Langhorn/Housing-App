"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import HouseCards from "../components/HouseCards";
import { useAuth } from "@clerk/nextjs";
import AddHouseModal from "../components/AddHouseModal";
import { uploadToPinata } from "../utilis/pinata";
import type { House } from "@/app/components/HouseCards";

const Page = () => {
  const { userId } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  useEffect(() => {
    if (!userId) setLoading(false);

    const getUserHouses = async () => {
      try {
        const res = await axios.get(
          `${DATABASE_URL}/api/users/${userId}/houses`
        );
        console.log("Houses fetched successfully:", res.data);
        // You can process the fetched data here
        setHouses(res.data);
      } catch (error) {
        console.error("Error fetching houses:", error);
      } finally {
        setLoading(false);
      }
    };
    // Call the function to fetch houses
    getUserHouses();
  }, [userId, DATABASE_URL]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { getToken } = useAuth();

  const handleAddHouse = async (formData: FormData) => {
    const token = await getToken();
    if (!token) {
      console.error("User is not authenticated.");
      return;
    }

    try {
      setLoading(true);

      // Get the file from FormData
      const imageFile = formData.get("image") as File;

      // Upload to Pinata first
      const imageUrl = await uploadToPinata(imageFile);

      // Create a regular object with all the house data
      const houseData = {
        address: formData.get("address") as string,
        postal_code: formData.get("postal_code") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        price: Number(formData.get("price")),
        bedrooms: Number(formData.get("bedrooms")),
        bathrooms: Number(formData.get("bathrooms")),
        square_feet: Number(formData.get("square_feet")),
        year_built: Number(formData.get("year_built")),
        image: imageUrl, // Use the Pinata URL
        clerk_id: userId, // Add user ID
      };

      const res = await axios.post(`${DATABASE_URL}/api/houses`, houseData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Send as JSON
        },
      });

      console.log("House added successfully:", res.data);
      setHouses((prevHouses) => [...prevHouses, res.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding house:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-center text-balance text-3xl font-bold mb-6">
          My Homes
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 py-16">
            {!userId ? (
              <div className="col-span-full flex justify-center items-center">
                <p className="text-center text-red-500">
                  Please log in to view your houses.
                </p>
              </div>
            ) : houses.length === 0 ? (
              <div className="col-span-full flex justify-center items-center flex-col">
                <p className="text-center text-gray-500">
                  You have no houses listed.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)} // <-- Only open modal
                  className="btn btn-neutral mt-4"
                >
                  Add a House
                </button>
                <AddHouseModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSubmit={handleAddHouse}
                />
              </div>
            ) : (
              <>
                <div className="col-span-full flex justify-center items-center flex-col mb-8">
                  <button
                    onClick={() => setIsModalOpen(true)} // <-- Only open modal
                    className="btn btn-neutral mt-4"
                  >
                    Add a House
                  </button>
                </div>
                <AddHouseModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onSubmit={handleAddHouse}
                />
                {houses.map((house) => (
                  <HouseCards key={house.address} house={house} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
// This page will render the user's houses, which are fetched from the API.
