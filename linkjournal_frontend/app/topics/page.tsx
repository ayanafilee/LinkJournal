'use client';

import React, { useState, useEffect } from 'react';
import { useGetTopicsQuery, useCreateTopicMutation } from '@/store/api/apiSlice';
import TopicGrid from '@/components/TopicGrid';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { handleError } from '@/lib/errorHandler';

// Define PageWrapper outside to prevent focus loss issues
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <main className="w-full min-h-screen bg-gray-50 py-4 sm:py-10">
    <div className="max-w-7xl mx-auto px-6">{children}</div>
  </main>
);

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  const {
    data: topics = [],
    isLoading,
    isError,
    error
  } = useGetTopicsQuery();

  const [createTopic] = useCreateTopicMutation();
  const [topicName, setTopicName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    try {
      await createTopic({ name: topicName }).unwrap();
      setTopicName('');
    } catch (err) {
      handleError(err, 'Failed to create topic');
    }
  };

  if (!mounted) return null;

  // FIXED: Centered Loading State
  if (isLoading)
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600 mb-6"></div>
          <p className="text-xl font-semibold text-blue-600 animate-pulse">
            Loading Topics...
          </p>
        </div>
      </PageWrapper>
    );

  if (isError)
    return (
      <PageWrapper>
        <ErrorDisplay
          variant="error"
          title="Failed to Load Topics"
          message="We couldn't load your topics. Please try again."
          onRetry={() => window.location.reload()}
        />
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