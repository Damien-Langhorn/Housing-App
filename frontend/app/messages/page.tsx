"use client";

import React from "react";
import ConversationsList from "../components/ConversationList";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const MessagesPage = () => {
  const { userId } = useAuth();

  if (!userId) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-4">
            Please sign in to view your messages.
          </p>
          <Link href="/houses" className="btn btn-outline btn-sm">
            Browse Houses
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-black pb-8">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Messages</h1>
            <Link href="/houses" className="btn btn-secondary btn-sm">
              Browse Houses
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            All your conversations about house listings
          </p>
        </div>

        {/* Conversations List */}
        <div className="bg-neutral rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Recent Conversations</h2>
          </div>
          <div className="p-4">
            <ConversationsList />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MessagesPage;
