"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetJournalsByTopicQuery, useGetTopicByIdQuery } from "@/store/api/apiSlice";
import JournalCard from "@/components/JournalCard";
import type { LinkJournal } from "@/types/index";
import Link from "next/link";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";

export default function TopicJournalsPage() {
  const params = useParams();
  const topicId = params.id as string;

  // Fetch Topic Name
  const { data: topicData, isLoading: isTopicLoading } = useGetTopicByIdQuery(topicId);
  
  // Fetch Journals for this topic
  const { data: journals, isLoading: isJournalsLoading, error } = useGetJournalsByTopicQuery(topicId);

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <main className="w-full min-h-screen bg-gray-50 py-4 sm:py-10">
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </main>
  );

  if (isTopicLoading || isJournalsLoading)
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-xl font-semibold text-gray-600">Loading your collection...</p>
        </div>
      </PageWrapper>
    );

  if (error)
    return (
      <PageWrapper>
        <div className="text-center text-xl font-semibold text-red-500 py-20">
          Failed to load journals for this topic.
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      {/* Header with Navigation */}
      <div className="mb-10">
        <Link 
          href="/topics" 
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 capitalize">
              {topicData?.name || "Topic Journals"}
            </h1>
            <p className="text-gray-500 mt-2 flex items-center gap-2">
              <BookOpen size={18} />
              Found {journals?.length || 0} links in this category
            </p>
          </div>

          <Link href="/create_journal">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
              + Add New Link
            </button>
          </Link>
        </div>
      </div>

      {/* Journals Grid */}
      {journals && journals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {journals.map((journal: LinkJournal) => (
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
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[50px] border-2 border-dashed border-gray-200">
          <div className="bg-blue-50 p-6 rounded-full mb-4">
            <BookOpen className="text-blue-400" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Empty Topic</h2>
          <p className="text-gray-500 mt-2 text-center max-w-xs">
            You haven't added any links to <strong>{topicData?.name}</strong> yet.
          </p>
          <Link href="/create_journal">
            <button className="mt-8 text-blue-600 font-bold border-2 border-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition-all">
              Create First Entry
            </button>
          </Link>
        </div>
      )}
    </PageWrapper>
  );
}