"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { House } from "./HouseCards";

type Message = {
  _id: string;
  sender_id: string;
  receiver_id: string;
  house_id: string;
  content: string;
  read: boolean;
  createdAt: string;
};

type MessageInterfaceProps = {
  houseId: string;
  otherUserId: string;
  house: House | null;
  onMessagesRead?: () => void; // ✅ ADD: Optional callback
};

const MessageInterface = ({
  houseId,
  otherUserId,
  house,
  onMessagesRead, // ✅ ADD: Destructure the callback
}: MessageInterfaceProps) => {
  const { userId, getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${BACKEND_URL}/api/messages/${houseId}/${otherUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [houseId, otherUserId, getToken, BACKEND_URL]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = await getToken();
      const response = await axios.post(
        `${BACKEND_URL}/api/messages`,
        {
          receiver_id: otherUserId,
          house_id: houseId,
          content: newMessage.trim(),
          message_type: "inquiry",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  // Mark messages as read
  useEffect(() => {
    const markMessagesAsRead = async () => {
      try {
        const token = await getToken();
        console.log("=== Marking messages as read for:", {
          houseId,
          otherUserId,
        });

        const response = await axios.patch(
          `${BACKEND_URL}/api/messages/read`,
          {
            house_id: houseId,
            sender_id: otherUserId, // Messages FROM the other user
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("=== Mark as read response:", response.data);

        // ✅ ADD: Call the callback if messages were marked as read
        if (response.data.updatedCount > 0 && onMessagesRead) {
          onMessagesRead();
        }
      } catch (error) {
        console.error(
          "Error marking messages as read:",
          error instanceof Error ? error.message : error
        );
      }
    };

    if (houseId && otherUserId) {
      markMessagesAsRead();
    }
  }, [houseId, otherUserId, getToken, BACKEND_URL, onMessagesRead]);

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b rounded-lg bg-neutral">
        <h3 className="font-semibold">
          Inquiry about: {house?.address}, {house?.city}
        </h3>
        <p className="text-sm ">${house?.price}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender_id === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_id === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 input input-bordered"
            maxLength={1000}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInterface;
