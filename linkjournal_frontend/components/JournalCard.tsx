"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { useToggleImportantMutation, useDeleteJournalMutation } from '@/store/api/apiSlice';
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Mutations
  const [toggleImportant, { isLoading: isToggling }] = useToggleImportantMutation();
  const [deleteJournal, { isLoading: isDeleting }] = useDeleteJournalMutation();

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/journal/${id}`);
  };

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    try {
      await toggleImportant(id).unwrap();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Toggle Important Error:", error);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteJournal(id).unwrap();
      toast.success("Journal deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete journal");
    }
  };

  return (
    <>
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
        {/* Delete Icon */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
          className="absolute top-8 right-10 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Journal"
        >
          <Trash2 size={24} />
        </button>

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
        <p className="text-xl text-gray-800 italic font-serif leading-relaxed text-center mb-8 line-clamp-3">
          {description}
        </p>

        {/* Footer: Star and Important Label */}
        <div className="flex items-center justify-between w-full px-4 mt-auto">
          <span className="text-xl font-bold text-black">Important</span>
          
          <button 
            onClick={handleToggleStar}
            disabled={isToggling}
            className="focus:outline-none transition-transform active:scale-90 disabled:opacity-50"
          >
            {isToggling ? (
              <Loader2 size={24} className="animate-spin text-gray-400" />
            ) : (
              <Star 
                size={28} 
                fill={isImportant ? "#9ca3af" : "none"} 
                className={isImportant ? "text-gray-400" : "text-gray-300 hover:text-yellow-400"} 
              />
            )}
          </button>
        </div>
      </div>

      {/* ======================= CUSTOM DELETE MODAL ========================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="
              bg-white rounded-[40px] p-8 max-w-md w-full 
              shadow-2xl flex flex-col items-center
              animate-in zoom-in-95 duration-200
            "
          >
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Journal?</h2>
            <p className="text-gray-500 text-center mb-8">
              This action cannot be undone. You will permanently lose the journal <strong>"{name}"</strong>.
            </p>

            <div className="flex gap-4 w-full">
              {/* Cancel Button */}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="
                  flex-1 py-3 px-6 rounded-2xl font-semibold text-gray-700
                  bg-gray-100 hover:bg-gray-200 transition-colors
                "
              >
                Cancel
              </button>

              {/* Confirm Delete Button */}
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="
                  flex-1 py-3 px-6 rounded-2xl font-semibold text-white
                  bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200
                  transition-all active:scale-95 disabled:opacity-70
                  flex items-center justify-center gap-2
                "
              >
                {isDeleting ? <Loader2 size={20} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}