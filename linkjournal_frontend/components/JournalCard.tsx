"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, Trash2, AlertTriangle, ExternalLink } from "lucide-react";
import { useToggleImportantMutation, useDeleteJournalMutation } from "@/store/api/apiSlice";
import { handleError, handleSuccess, handleWarning } from "@/lib/errorHandler";

type JournalCardProps = {
  id: string;
  name: string;
  description: string;
  isImportant: boolean;
  link?: string; // Added link prop
};

export default function JournalCard({
  id,
  name,
  description,
  isImportant,
  link,
}: JournalCardProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [toggleImportant, { isLoading: isToggling }] = useToggleImportantMutation();
  const [deleteJournal, { isLoading: isDeleting }] = useDeleteJournalMutation();

  // Navigates to the internal details page
  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/journal/${id}`);
  };

  // Directly opens the website URL
  const handleExternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (link) {
      // Ensure the link has a protocol
      let url = link;
      if (!/^https?:\/\//i.test(link)) {
        url = 'https://' + link;
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      handleWarning("No link available");
    }
  };

  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleImportant(id).unwrap();
    } catch (error) {
      handleError(error, "Failed to update status");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteJournal(id).unwrap();
      handleSuccess("Journal deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      handleError(error, "Failed to delete journal");
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
          hover:scale-[1.02]
        "
      >
        {/* NEW: External Link Arrow (Top Right) */}
        <button
          onClick={handleExternalClick}
          className="absolute top-8 right-10 p-3 bg-white rounded-full shadow-sm text-blue-600 hover:bg-blue-600 hover:text-white transition-all group z-20"
          title="Visit Website"
        >
          <ExternalLink size={20} className="group-active:scale-90" />
        </button>

        {/* Clickable Title */}
        <h3
          onClick={handleTitleClick}
          className="
            text-3xl font-bold mb-6 text-center 
            text-gray-900 hover:text-blue-600 
            cursor-pointer transition-colors duration-200
            px-6
          "
        >
          {name}
        </h3>

        {/* Description */}
        <p className="text-lg text-gray-600 italic font-serif leading-relaxed text-center mb-10 line-clamp-3">
          "{description}"
        </p>

        {/* Footer: Important Label + Star + Trash */}
        <div className="flex items-center justify-between w-full px-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-xl font-black text-black">Important</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Star Icon */}
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
                  fill={isImportant ? "#EAB308" : "none"}
                  className={isImportant ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}
                />
              )}
            </button>

            {/* Trash Icon (Moved next to Important/Star) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title="Delete"
            >
              <Trash2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal Logic remains the same */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl flex flex-col items-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Delete this Journal?</h2>
            <p className="text-gray-500 text-center mb-8">
              This will permanently remove <strong>"{name}"</strong> and all its saved data.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 px-6 rounded-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Keep it
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-3 px-6 rounded-2xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
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