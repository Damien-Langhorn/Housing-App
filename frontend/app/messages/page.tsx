"use client";

import React from "react";
import ConversationsList from "../components/ConversationList";
import Link from "next/link";

const MessagesPage = () => {
  return (
    <section className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <Link href="/houses" className="btn btn-primary btn-sm">
              Browse Houses
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            All your conversations about house listings
          </p>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">
              Recent Conversations
            </h2>
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
