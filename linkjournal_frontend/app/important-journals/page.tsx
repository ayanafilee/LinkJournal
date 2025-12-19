"use client";

import { useGetJournalsQuery } from "@/store/api/apiSlice";
import JournalCard from "@/components/JournalCard";
import type { LinkJournal } from "@/types/index";
import { Star } from "lucide-react";
import Link from "next/link";

export default function ImportantJournalsPage() {
  const { data, isLoading, error } = useGetJournalsQuery();

  // Filter journals to only show the ones marked as important
  const importantJournals = data?.filter((journal) => journal.is_important) || [];

  // Shared layout wrapper
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <main className="w-full min-h-screen bg-gray-50 py-4 sm:py-10">
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </main>
  );

  if (isLoading)
    return (
      <PageWrapper>
        <div className="text-center text-xl font-semibold text-blue-600 py-20">
          Loading Important Journals...
        </div>
      </PageWrapper>
    );

  if (error)
    return (
      <PageWrapper>
        <div className="text-center text-xl font-semibold text-red-500 py-20">
          Failed to load journals
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

        <Link href="/journals">
          <button
            className="
              bg-white
              border border-gray-200
              text-gray-700
              px-5
              py-2.5
              rounded-lg
              font-medium
              hover:bg-gray-50
              shadow-sm
              transition
            "
          >
            Back to All Journals
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] shadow-inner border border-gray-100">
          <div className="bg-yellow-50 p-6 rounded-full mb-4">
            <Star className="text-yellow-400" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">No Important Links Yet</h2>
          <p className="text-gray-500 mt-2 text-center max-w-sm px-6">
            Star your most used links in the main dashboard to see them appear here for quick access.
          </p>
          <Link href="/journals" className="mt-8 text-blue-600 font-semibold hover:underline">
            Go to My Journals →
          </Link>
        </div>
      )}
    </PageWrapper>
  );
}