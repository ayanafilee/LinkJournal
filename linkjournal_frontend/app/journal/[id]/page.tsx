"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetJournalByIdQuery, useGetTopicByIdQuery } from '@/store/api/apiSlice';
import { Loader2, ExternalLink, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export default function JournalDetailsPage() {
  const params = useParams();
  const journalId = params.id as string;

  const { data: journal, isLoading: journalLoading, error: journalError } = useGetJournalByIdQuery(journalId);

  // FIX: Cast topic_id to string to satisfy TypeScript, 
  // the 'skip' property ensures it never actually runs if it's undefined.
  const { data: topic, isLoading: topicLoading, isError: topicError } = useGetTopicByIdQuery(
    journal?.topic_id as string, 
    { skip: !journal?.topic_id } 
  );

  if (journalLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#F8F9FA]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-blue-600 font-semibold">Loading Journal Details...</p>
      </div>
    );
  }

  if (journalError || !journal) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Journal entry not found.</h2>
        <Link href="/" className="text-blue-600 hover:underline mt-4 block">Return Home</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-8 transition-colors font-medium">
          <ArrowLeft size={20} /> Back to Journals
        </Link>

        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
          {journal.screenshot && (
            <div className="w-full h-80 overflow-hidden">
              <img src={journal.screenshot} alt={journal.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{journal.name}</h1>
            
            <a href={journal.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 mb-8 transition-colors">
              Visit Original Link <ExternalLink size={18} />
            </a>

            <div className="space-y-8">
              <div>
                <h2 className="text-xs uppercase tracking-widest text-gray-400 font-black mb-3">Description</h2>
                <p className="text-xl text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                  {journal.description}
                </p>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3">
                   <h2 className="text-xs uppercase tracking-widest text-gray-400 font-black">Topic</h2>
                   <div className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold border border-blue-100">
                    <Tag size={16} />
                    {topicLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" /> Fetching...
                      </span>
                    ) : (
                      // If there is an error (404) or no data, show Uncategorized
                      topicError || !topic ? "General / Uncategorized" : topic.name
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}