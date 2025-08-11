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
};

const MessageInterface = ({
  houseId,
  otherUserId,
  house,
}: MessageInterfaceProps) => {
  const { userId, getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(
          `${DATABASE_URL}/api/messages/${houseId}/${otherUserId}`,
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
  }, [houseId, otherUserId, getToken, DATABASE_URL]);

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
        `${DATABASE_URL}/api/messages`,
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

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-semibold">
          Inquiry about: {house?.address}, {house?.city}
        </h3>
        <p className="text-sm text-gray-600">${house?.price}</p>
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
