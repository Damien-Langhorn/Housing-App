"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

type Conversation = {
  _id: string;
  participants: string[];
  house_id: {
    _id: string;
    address: string;
    city: string;
    state: string;
    price: number;
    image: string;
  };
  last_message: {
    _id: string;
    content: string;
    sender_id: string;
    createdAt: string;
  };
  last_message_time: string;
};

const ConversationsList = () => {
  const { userId, getToken } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>(
    {}
  );
  const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  const fetchUserNames = async (userIds: string[]) => {
    try {
      const token = await getToken();
      const promises = userIds.map(async (id) => {
        try {
          // Call your backend to get user info from Clerk
          const response = await axios.get(
            `${DATABASE_URL}/api/users/clerk/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          return {
            id,
            username:
              response.data.username ||
              response.data.firstName ||
              "Unknown User",
          };
        } catch (error) {
          console.error(`Error fetching user ${id}:`, error);
          return { id, username: "Unknown User" };
        }
      });

      const results = await Promise.all(promises);
      const nameMap = results.reduce((acc, { id, username }) => {
        acc[id] = username;
        return acc;
      }, {} as { [key: string]: string });

      setUserNames((prev) => ({ ...prev, ...nameMap }));
    } catch (error) {
      console.error("Error fetching usernames:", error);
    }
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${DATABASE_URL}/api/messages/conversations`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setConversations(response.data);

        const allUserIds = response.data.flatMap(
          (conv: Conversation) => conv.participants
        );
        const uniqueUserIds = [...new Set(allUserIds)].filter(
          (id) => id !== userId
        );

        if (uniqueUserIds.length > 0) {
          await fetchUserNames(uniqueUserIds);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchConversations();
    }
  }, [userId, getToken, DATABASE_URL]);

  // Fetch unread counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${DATABASE_URL}/api/messages/unread-counts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUnreadCounts(response.data);
      } catch (error) {
        console.error("Error fetching unread counts:", error);
      }
    };

    if (userId) {
      fetchUnreadCounts();
    }
  }, [userId, getToken, DATABASE_URL]);

  // Get the other participant in the conversation
  const getOtherParticipant = (participants: string[]) => {
    return participants.find((p) => p !== userId) || "";
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view your messages.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading conversations...</p>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No conversations yet.</p>
        <p className="text-sm text-gray-400 mt-2">
          Start by contacting sellers on house listings!
        </p>
        <Link href="/houses" className="btn btn-primary mt-4">
          Browse Houses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => {
        const otherUserId = getOtherParticipant(conversation.participants);
        const otherUserName = userNames[otherUserId] || "Unknown User";
        const isFromMe = conversation.last_message?.sender_id === userId;

        return (
          <Link
            key={conversation._id}
            href={`/messages/${conversation.house_id._id}/${otherUserId}`}
            className="block"
          >
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                {/* House Image */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={conversation.house_id.image}
                    alt="House"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Conversation Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm truncate">
                        {otherUserName}
                      </h3>
                      <h3 className="font-semibold text-sm truncate">
                        {conversation.house_id.address}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {conversation.house_id.city},{" "}
                        {conversation.house_id.state} • $
                        {conversation.house_id.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatTime(conversation.last_message_time)}
                    </span>
                  </div>

                  {/* Last Message Preview */}
                  {conversation.last_message && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 truncate">
                        {isFromMe ? "You: " : `${otherUserName}: `}
                        {conversation.last_message.content}
                      </p>
                    </div>
                  )}
                </div>

                {/* Unread Messages Badge */}
                {unreadCounts[conversation._id] > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    {unreadCounts[conversation._id]}
                  </span>
                )}

                {/* Arrow indicator */}
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationsList;
