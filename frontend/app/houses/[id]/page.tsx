"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import type { House } from "@/app/components/HouseCards";
import Image from "next/image";
// ...existing code...

const Page = () => {
  const { id } = useParams();
  const [house, setHouse] = useState<House>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/houses/${id}`);
        console.log("House fetched successfully:", res.data);
        setHouse(res.data);
      } catch (error) {
        console.error("Error fetching house:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchHouse();
  }, [id]);

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

  return (
    <section className="min-h-screen flex justify-center overflow-hidden">
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
          <p className="mb-2">{house.address}</p>
          <p>Year Built: {house.year_built}</p>
        </div>
      </div>
    </section>
  );
};

export default Page;
