import React from "react";

interface TopicCardProps {
  topicName: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ topicName }) => {
  return (
    <div
      className="
        p-6
        bg-gray-100
        rounded-xl
        shadow-md
        hover:shadow-lg
        transition-shadow
        flex items-center justify-center
        min-h-[8rem]
        font-semibold
        text-lg
        text-gray-800
        cursor-pointer
        transform hover:scale-[1.01] transition-transform duration-150
        border border-gray-200
        [box-shadow:5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff,inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#bebebe]
      "
    >
      {topicName}
    </div>
  );
};

export default TopicCard;
