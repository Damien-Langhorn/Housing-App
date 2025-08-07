"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import MessageInterface from "@/app/components/MessageInterface";
import { useAuth } from "@clerk/nextjs";

const MessagePage = () => {
  const { houseId, userId: otherUserId } = useParams();
  const { userId } = useAuth();
  const router = useRouter();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await axios.get(
          `${DATABASE_URL}/api/houses/${houseId}`
        );
        setHouse(response.data);
      } catch (error) {
        console.error("Error fetching house:", error);
        router.push("/houses");
      } finally {
        setLoading(false);
      }
    };

    if (houseId) fetchHouse();
  }, [houseId, DATABASE_URL, router]);

  if (!userId) {
    return <div>Please sign in to access messages.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!house) {
    return <div>House not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="btn btn-ghost mb-4">
        ← Back
      </button>

      <MessageInterface
        houseId={houseId as string}
        otherUserId={otherUserId as string}
        house={house}
      />
    </div>
  );
};

export default MessagePage;
