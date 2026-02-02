"use client";

import React, { useState, useEffect } from "react";
import { useGetJournalsQuery } from "@/store/api/apiSlice";
import JournalCard from "@/components/JournalCard";
import type { LinkJournal } from "@/types/index";
import Link from "next/link";

// 1. Move PageWrapper outside to keep component references stable
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <main className="w-full min-h-screen bg-gray-50 py-4 sm:py-10">
    <div className="max-w-7xl mx-auto px-6">{children}</div>
  </main>
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, error } = useGetJournalsQuery();

  // 2. Hydration fix: ensures client-side logic matches server
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering until client is ready (solves the Console Error)
  if (!mounted) return null;

  if (isLoading)
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl font-semibold text-blue-600">
            Loading Your Journals...
          </div>
        </div>
      </PageWrapper>
    );

  if (error)
    return (
      <PageWrapper>
        <div className="text-center text-xl font-semibold text-red-500 py-20 bg-red-50 rounded-2xl border border-red-100">
          Failed to load journals. Please try again later.
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          My Journals
        </h1>

        <Link href="/create_journal">
          <button
            className="
              bg-blue-600
              text-white
              px-6
              py-3
              rounded-xl
              font-bold
              shadow-lg shadow-blue-200
              hover:bg-blue-700
              hover:scale-105
              active:scale-95
              transition-all
            "
          >
            Add New Link
          </button>
        </Link>
      </div>

      {/* Journals Grid */}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((journal: LinkJournal) => (
            <JournalCard
              key={journal.id || (journal as any)._id}
              id={journal.id || (journal as any)._id}
              name={journal.name}
              description={journal.description ?? ""}
              isImportant={journal.is_important}
              link={journal.link}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No journals found yet.</p>
          <Link href="/create_journal" className="text-blue-600 font-bold hover:underline">
            Create your first one now
          </Link>
        </div>
      )}
    </PageWrapper>
  );
}