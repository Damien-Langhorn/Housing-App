"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import HouseCards from "../components/HouseCards";
import { useAuth } from "@clerk/nextjs";

type House = {
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
  clerk_id: string; // Assuming this is the user ID associated with the house
};

const Page = () => {
  const { userId } = useAuth();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  useEffect(() => {
    const getHouses = async () => {
      try {
        console.log("Fetching houses from:", DATABASE_URL);
        const res = await axios.get(`${DATABASE_URL}/api/houses`);
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
    getHouses();
  }, [DATABASE_URL]);

  // Filter houses based on the userId
  // If userId is present, exclude houses associated with that user
  const filteredHouses = userId
    ? houses.filter((house) => house.clerk_id !== userId)
    : houses;

  return (
    <section className="min-h-screen overflow-hidden">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-center text-balance text-3xl font-bold mb-6">
          Explore our collection of beautiful homes!
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 py-16">
            {filteredHouses.map((house) => (
              <HouseCards key={house._id} house={house} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
