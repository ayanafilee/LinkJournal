import React from "react";
import TopicCard from "./TopicCard";

interface Topic {
  id: number;
  name: string;
}

interface TopicGridProps {
  topics: Topic[];
  topicName: string;
  setTopicName: (name: string) => void;
  handleCreateTopic: (e: React.FormEvent) => void;
}

const TopicGrid: React.FC<TopicGridProps> = ({
  topics,
  topicName,
  setTopicName,
  handleCreateTopic,
}) => {
  return (
    <div className="container mx-auto p-4 sm:p-8 bg-gray-50 min-h-screen">
      {/* Header + Form */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
          My Topics Dashboard
        </h1>

        <form onSubmit={handleCreateTopic} className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            placeholder="New Topic Name"
            className="
              border border-gray-300
              p-2 flex-grow sm:flex-none sm:w-64
              rounded-lg shadow-sm
              focus:ring-blue-500 focus:border-blue-500
              bg-white text-gray-900
            "
          />
          <button
            type="submit"
            className="
              bg-blue-600
              text-white
              font-medium
              py-2 px-4
              rounded-lg
              shadow-md
              hover:bg-blue-700
              transition-colors
              whitespace-nowrap
            "
          >
            Add New Topic
          </button>
        </form>
      </div>

      {/* Topic Grid */}
      <div
        className="
          grid
          gap-6
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-3
        "
      >
        {topics.map((topic) => (
          <TopicCard key={topic.id} topicName={topic.name} />
        ))}
      </div>

      {topics.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          No topics found. Use the form above to create your first topic!
        </p>
      )}
    </div>
  );
};

export default TopicGrid;
