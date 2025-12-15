// app/page.tsx

'use client';

import React, { useState } from 'react';
import { useGetTopicsQuery, useCreateTopicMutation } from '@/store/api/apiSlice';

export default function HomePage() {
  // Default topics to an empty array to avoid undefined
  const { data: topics = [], isLoading, isError, error } = useGetTopicsQuery();
  const [createTopic] = useCreateTopicMutation();
  const [topicName, setTopicName] = useState('');

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    try {
      await createTopic({ name: topicName }).unwrap();
      setTopicName('');
      alert('Topic created successfully!');
    } catch (err) {
      console.error('Failed to create topic:', err);
      alert('Error creating topic. Check console.');
    }
  };

  if (isLoading) return <div className="p-4">Loading Topics...</div>;
  if (isError)
    return (
      <div className="p-4 text-red-500">
        Error: {(error as any)?.data?.error || 'Failed to fetch topics'}
      </div>
    );

  return (
    <div className="p-8 bg-amber-700">
      <h1 className="text-2xl font-bold mb-4">Topic Manager</h1>

      <form onSubmit={handleCreateTopic} className="mb-8 flex gap-2">
        <input
          type="text"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          placeholder="New Topic Name (e.g., Go/Gin Learning)"
          className="border p-2 flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Topic
        </button>
      </form>

      <h2 className="text-xl mb-2">My Topics</h2>
      <ul className="list-disc pl-5">
        {topics.map((topic) => (
          <li key={topic.id} className="mb-1">
            {topic.name} (ID: {topic.id})
          </li>
        ))}
      </ul>
    </div>
  );
}





