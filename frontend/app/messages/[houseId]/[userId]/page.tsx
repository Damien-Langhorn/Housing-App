"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import MessageInterface from "@/app/components/MessageInterface";

const MessagePage = () => {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);

  const houseId = params.houseId as string;
  const otherUserId = params.userId as string;
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${DATABASE_URL}/api/houses/${houseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHouse(response.data);
      } catch (error) {
        console.error("Error fetching house:", error);
      } finally {
        setLoading(false);
      }
    };

    if (houseId) {
      fetchHouse();
    }
  }, [houseId, getToken, DATABASE_URL]);

  const handleMessagesRead = () => {
    window.dispatchEvent(
      new CustomEvent("messagesRead", {
        detail: { houseId, otherUserId },
      })
    );
  };

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
        houseId={houseId}
        otherUserId={otherUserId}
        house={house}
        onMessagesRead={handleMessagesRead}
      />
    </div>
  );
};

export default MessagePage;
