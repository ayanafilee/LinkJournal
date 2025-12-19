"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, Loader2 } from 'lucide-react';
import { useToggleImportantMutation } from '@/store/api/apiSlice';
import toast from 'react-hot-toast';

type JournalCardProps = {
  id: string; 
  name: string;
  description: string;
  isImportant: boolean;
};

export default function JournalCard({
  id,
  name,
  description,
  isImportant,
}: JournalCardProps) {
  const router = useRouter();
  
  // Hook for toggling importance
  const [toggleImportant, { isLoading: isToggling }] = useToggleImportantMutation();

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/journal/${id}`);
  };

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card or title triggers
    try {
      await toggleImportant(id).unwrap();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Toggle Important Error:", error);
    }
  };

  return (
    <div
      className="
        relative flex flex-col items-center
        p-10 w-full max-w-sm 
         bg-gray-100 
        rounded-[60px] 
        shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff]
        transition-all duration-300
      "
    >
      {/* Clickable Title */}
      <h3 
        onClick={handleTitleClick}
        className="
          text-3xl font-medium mb-6 text-center 
          text-blue-600 hover:text-blue-800 
          cursor-pointer hover:underline underline-offset-4
          transition-colors duration-200
        "
      >
        {name}
      </h3>

      {/* Description */}
      <p className="text-xl text-gray-800 italic font-serif leading-relaxed text-center mb-8">
        {description}
      </p>

      {/* Footer: Star and Important Label */}
      <div className="flex items-center justify-between w-full px-4 mt-auto">
        <span className="text-xl font-bold text-black">Important</span>
        
        <button 
          onClick={handleToggleStar}
          disabled={isToggling}
          className="focus:outline-none transition-transform active:scale-90 disabled:opacity-50"
          title={isImportant ? "Remove from important" : "Mark as important"}
        >
          {isToggling ? (
            <Loader2 size={24} className="animate-spin text-gray-400" />
          ) : (
            <Star 
              size={28} 
              // Fill with gray color if important, otherwise transparent
              fill={isImportant ? "#9ca3af" : "none"} 
              className={`transition-colors ${
                isImportant ? "text-gray-400" : "text-gray-300 hover:text-yellow-400"
              }`} 
            />
          )}
        </button>
      </div>
    </div>
  );
}