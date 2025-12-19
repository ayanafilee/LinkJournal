"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useGetJournalByIdQuery } from '@/store/api/apiSlice';
import { Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JournalDetailsPage() {
  const params = useParams();
  const journalId = params.id as string;

  // Fetching specific journal data
  const { data: journal, isLoading, error } = useGetJournalByIdQuery(journalId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (error || !journal) {
    return <div className="p-10 text-center">Journal entry not found.</div>;
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/journals" className="flex items-center gap-2 text-gray-500 hover:text-blue-500 mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Journals
        </Link>

        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
          {/* Cover Photo */}
          {journal.screenshot && (
            <div className="w-full h-72 overflow-hidden">
              <img 
                src={journal.screenshot} 
                alt={journal.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{journal.name}</h1>
            
            {/* Direct Link to the resource */}
            <a 
              href={journal.link} 
              target="_blank" 
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:underline mb-8"
            >
              Visit Original Link <ExternalLink size={16} />
            </a>

            <div className="space-y-6">
              <div>
                <h2 className="text-sm uppercase tracking-widest text-gray-400 font-bold mb-2">Description</h2>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {journal.description}
                </p>
              </div>

              {/* Tag/Topic Display */}
              <div className="pt-6 border-t border-gray-100">
                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold">
                  Topic ID: {journal.topic_id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}