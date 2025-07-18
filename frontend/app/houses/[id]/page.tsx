"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import type { House } from "@/app/components/HouseCards";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const { userId } = useAuth();
  const { id } = useParams();
  const [house, setHouse] = useState<House>();
  const [loading, setLoading] = useState(true);
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await axios.get(`${DATABASE_URL}/api/houses/${id}`);
        console.log("House fetched successfully:", res.data);
        setHouse(res.data);
      } catch (error) {
        console.error("Error fetching house:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHouse();
  }, [id, DATABASE_URL]);

  if (loading)
    return (
      <div className="flex justify-center items-center text-center min-h-screen">
        Loading...
      </div>
    );
  if (!house)
    return (
      <div className="flex justify-center items-center text-center min-h-screen">
        House not found.
      </div>
    );

  const handleContactSeller = () => {
    // Logic to handle contacting the seller, e.g., opening a contact form or redirecting
    console.log("Contacting seller for house:", house._id);
    if (!userId) {
      alert("Please sign in to contact the seller.");
      return;
    }
  };

  return (
    <section className="min-h-screen flex justify-center overflow-hidden flex-col items-center">
      <div className="container flex flex-col md:flex-row justify-evenly items-center">
        <div className="flex justify-center items-center text-center w-[50vw]">
          <Image
            width={500}
            height={500}
            src={house.image}
            alt="House Image"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col justify-center text-left">
          <h2 className="text-2xl font-bold mb-4">
            {house.city}, {house.state}
          </h2>
          <p className="text-lg mb-2">${Math.round(house.price)}</p>
          <p className="mb-2">
            {house.bedrooms} {house.bedrooms === 1 ? "Bedroom" : "Bedrooms"} |{" "}
            {house.bathrooms} {house.bathrooms === 1 ? "Bathroom" : "Bathrooms"}{" "}
            | {house.square_feet} sqft
          </p>
          <p className="mb-2">
            {house.address}, {house.postal_code}
          </p>
          <p>Year Built: {house.year_built}</p>
        </div>
      </div>

      <div className="container mt-10 text-center">
        <p>
          Please contact the seller below if you are interested in this house.
        </p>
        <button onClick={handleContactSeller} className="btn btn-accent mt-4">
          Contact Seller
        </button>
      </div>
    </section>
  );
};

export default Page;
