// app/page.tsx

'use client';

import React, { useState } from 'react';
import { useGetTopicsQuery, useCreateTopicMutation } from '@/store/api/apiSlice';
import TopicGrid from '@/components/TopicGrid'; // Import the new component

// Define the expected Topic structure for better type safety
interface Topic {
    id: number;
    name: string;
}

export default function HomePage() {
  // Use the Topic interface for data typing
  const { 
    data: topics = [], // Default to empty array
    isLoading, 
    isError, 
    error 
  } = useGetTopicsQuery() as {
      data: Topic[] | undefined;
      isLoading: boolean;
      isError: boolean;
      error: any;
  };
  
  const [createTopic] = useCreateTopicMutation();
  const [topicName, setTopicName] = useState('');

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    try {
      // Use the proper object structure for the mutation payload
      await createTopic({ name: topicName }).unwrap(); 
      setTopicName('');
      // RTK Query will automatically refetch/update the cache thanks to tag invalidation
    } catch (err) {
      console.error('Failed to create topic:', err);
      // More user-friendly error display
      const errorMessage = (err as any)?.data?.message || 'Unknown error creating topic.';
      alert(`Error creating topic: ${errorMessage}`);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-xl text-blue-600">Loading Topics...</div>;
  
  if (isError)
    return (
      <div className="p-8 text-center text-xl text-red-500">
        Error loading topics: {(error as any)?.data?.error || 'Failed to fetch topics'}
      </div>
    );

return (
  <main className="w-full h-full min-h-full bg-gray-50 py-4 sm:py-10">
    <TopicGrid
      topics={topics}
      topicName={topicName}
      setTopicName={setTopicName}
      handleCreateTopic={handleCreateTopic}
    />
  </main>
);
}