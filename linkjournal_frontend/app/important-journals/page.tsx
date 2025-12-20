"use client";

import React, { useState, useEffect } from "react";
import { useGetJournalsQuery } from "@/store/api/apiSlice";
import JournalCard from "@/components/JournalCard";
import type { LinkJournal } from "@/types/index";
import { Star } from "lucide-react";
import Link from "next/link";

// FIX 1: Define PageWrapper OUTSIDE the main component
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <main className="w-full min-h-screen bg-gray-50 py-4 sm:py-10">
    <div className="max-w-7xl mx-auto px-6">{children}</div>
  </main>
);

export default function ImportantJournalsPage() {
  const [mounted, setMounted] = useState(false);
  const { data, isLoading, error } = useGetJournalsQuery();

  // FIX 2: Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter journals to only show the ones marked as important
  const importantJournals = data?.filter((journal) => journal.is_important) || [];

  // Prevent rendering until client-side is ready
  if (!mounted) return null;

  // FIX 3: Perfectly Centered Loading Animation
  if (isLoading)
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600 mb-6"></div>
          <p className="text-xl font-semibold text-blue-600 animate-pulse">
            Loading Important Journals...
          </p>
        </div>
      </PageWrapper>
    );

  if (error)
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading</h2>
            <p className="text-red-500">Failed to load your priority journals.</p>
          </div>
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Star className="text-yellow-500 fill-yellow-500" size={32} />
            Important Links
          </h1>
          <p className="text-gray-500 mt-1">Everything you've marked as priority</p>
        </div>

        <Link href="/">
          <button
            className="
              bg-white
              border border-gray-200
              text-gray-700
              px-5
              py-2.5
              rounded-xl
              font-bold
              hover:bg-gray-50
              shadow-sm
              transition-all
              active:scale-95
            "
          >
            Back to Home
          </button>
        </Link>
      </div>

      {/* Journals Grid */}
      {importantJournals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
          {importantJournals.map((journal: LinkJournal) => (
            <JournalCard
              key={journal.id || (journal as any)._id}
              id={journal.id || (journal as any)._id}
              name={journal.name}
              description={journal.description ?? ""}
              isImportant={journal.is_important}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-sm border border-gray-100">
          <div className="bg-yellow-50 p-6 rounded-full mb-4">
            <Star className="text-yellow-400" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Important Links Yet</h2>
          <p className="text-gray-500 mt-2 text-center max-w-sm px-6">
            Star your most used links in the main dashboard to see them appear here for quick access.
          </p>
          <Link href="/" className="mt-8 text-blue-600 font-bold hover:underline">
            Go to My Journals →
          </Link>
        </div>
      )}
    </PageWrapper>
  );
}