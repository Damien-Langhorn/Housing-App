"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import type { House } from "@/app/components/HouseCards";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import EditHouseModal from "@/app/components/EditHouseModal";
import { uploadToPinata } from "@/app/utils/pinata";

const Page = () => {
  const { userId, getToken } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [house, setHouse] = useState<House>();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleContactSeller = () => {
    if (!house) {
      console.error("House data not available");
      return;
    }
    if (!userId) {
      alert("Please sign in to contact the seller.");
      return;
    }
    // Redirect to messages page with house and seller info
    router.push(`/messages/${house._id}/${house.clerk_id}`);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const token = await getToken();

      // Handle image upload if new image is provided
      let imageUrl = house?.image; // Keep existing image by default
      const imageFile = formData.get("image") as File;

      if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadToPinata(imageFile);
      }

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
        image: imageUrl,
      };

      const update = await axios.put(
        `${DATABASE_URL}/api/houses/${id}`,
        houseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Refresh house data
      // Re-fetch or update state
      setHouse(update.data);
      setIsEditModalOpen(false);

      setLoading(false);
    } catch (error) {
      console.error("Error updating house:", error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to delete this house listing?")
    ) {
      return;
    }

    try {
      setDeleting(true);
      const token = await getToken();

      await axios.delete(`${DATABASE_URL}/api/houses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("House deleted successfully!");
      router.push("/userHouses"); // Redirect to user's houses page
    } catch (error) {
      console.error("Error deleting house:", error);
      alert("Failed to delete house. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // Check if the current user owns this house
  const isOwner = userId && house && house.clerk_id === userId;

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
    <section className="min-h-screen flex justify-center overflow-hidden flex-col items-center">
      <div className="container flex flex-col md:flex-row justify-evenly items-center">
        <div className="flex justify-center items-center text-center w-[80vw] sm:w-[50vw] my-4 md:mx-4">
          <Image
            width={500}
            height={500}
            src={house.image}
            alt="House Image"
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="flex flex-col items-start">
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
        {isOwner ? (
          // Show edit/delete buttons for house owner
          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-600">This is your listing</p>
            <div className="flex space-x-4">
              <button onClick={handleEdit} className="btn btn-primary">
                Edit Listing
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error"
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Listing"}
              </button>
            </div>
          </div>
        ) : (
          // Show contact seller for other users
          <div>
            <p className="text-gray-600 text-center text-balance px-4">
              Please contact the seller below if you are interested in this
              house.
            </p>
            <button
              onClick={handleContactSeller}
              className="btn btn-neutral mt-4"
            >
              Contact Seller
            </button>
          </div>
        )}
      </div>

      <EditHouseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        house={house}
      />
    </section>
  );
};

export default Page;
