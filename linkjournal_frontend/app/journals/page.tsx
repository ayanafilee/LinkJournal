"use client";

import { useGetJournalsQuery } from "@/store/api/apiSlice";
import JournalCard from "@/components/JournalCard";
import type { LinkJournal } from "@/types/index";
import Link from "next/link";

export default function JournalsPage() {
  const { data, isLoading, error } = useGetJournalsQuery();

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
          Loading Journals...
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
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          My Journals
        </h1>

        <Link href="/create_journal">
          <button
            className="
              bg-blue-600
              text-white
              px-5
              py-2.5
              rounded-lg
              font-medium
              hover:bg-blue-700
              transition
            "
          >
            Add New Link
          </button>
        </Link>
      </div>

      {/* Journals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
        {data?.map((journal: LinkJournal) => (
          <JournalCard
            key={journal.id}
            id={journal.id} // Added this prop to enable navigation
            name={journal.name}
            description={journal.description ?? ""}
            isImportant={journal.is_important}
          />
        ))}
      </div>
    </PageWrapper>
  );
}
