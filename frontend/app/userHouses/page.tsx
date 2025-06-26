"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import HouseCards from "../components/HouseCards";
import { useAuth } from "@clerk/nextjs";

type House = {
  user_id: string;
  _id: string;
  image: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  address: string;
  year_built: number;
};

const Page = () => {
  const { userId } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) setLoading(false);

    const getUserHouses = async () => {
      //const userId = await axios.get("http://localhost:3000/api/user");
      try {
        const res = await axios.get(
          `http://localhost:3000/api/user/${userId}/houses`
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
  }, [userId]);

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
              <div className="col-span-full flex justify-center items-center">
                <p className="text-center text-gray-500">
                  You have no houses listed.
                </p>
              </div>
            ) : (
              houses.map((house) => (
                <HouseCards key={house._id} house={house} />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
// This page will render the user's houses, which are fetched from the API.
