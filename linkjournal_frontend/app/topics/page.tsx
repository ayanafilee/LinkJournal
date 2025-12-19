'use client';

import React, { useState } from 'react';
import { useGetTopicsQuery, useCreateTopicMutation } from '@/store/api/apiSlice';
import TopicGrid from '@/components/TopicGrid';
import { Topic } from '@/types/index'; // Use shared type

export default function HomePage() {
  // RTK Query hook
  const { 
    data: topics = [], 
    isLoading, 
    isError, 
    error 
  } = useGetTopicsQuery();

  const [createTopic] = useCreateTopicMutation();
  const [topicName, setTopicName] = useState('');

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    try {
      await createTopic({ name: topicName }).unwrap(); 
      setTopicName('');
    } catch (err) {
      console.error('Failed to create topic:', err);
    }
  };

  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <main className="w-full min-h-screen bg-gray-50 py-4 sm:py-10">
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </main>
  );

  if (isLoading)
    return (
      <PageWrapper>
        <div className="text-center text-xl font-semibold text-blue-600 py-20">
          Loading Topics...
        </div>
      </PageWrapper>
    );

  if (isError)
    return (
      <PageWrapper>
        <div className="text-center text-xl font-semibold text-red-500 py-20">
          Error loading topics: {(error as any)?.data?.error || 'Failed to fetch topics'}
        </div>
      </PageWrapper>
    );

  return (
    <PageWrapper>
      <TopicGrid
        topics={topics}
        topicName={topicName}
        setTopicName={setTopicName}
        handleCreateTopic={handleCreateTopic}
      />
    </PageWrapper>
  );
}