"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { Trash2, Edit3, Loader2, AlertTriangle } from "lucide-react";
import { useDeleteTopicMutation, useUpdateTopicMutation } from "@/store/api/apiSlice";
import toast from "react-hot-toast";

interface TopicCardProps {
  id: string;
  topicName: string;
}

const TopicCard: React.FC<TopicCardProps> = ({ id, topicName }) => {
  const router = useRouter(); // Initialize router
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newTopicName, setNewTopicName] = useState(topicName);

  // RTK Query Mutations
  const [deleteTopic, { isLoading: isDeleting }] = useDeleteTopicMutation();
  const [updateTopic, { isLoading: isUpdating }] = useUpdateTopicMutation();

  // Navigation Handler
  const handleCardClick = () => {
    router.push(`/topics/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteTopic(id).unwrap();
      toast.success("Topic deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Failed to delete topic");
    }
  };

  const handleUpdate = async () => {
    if (!newTopicName.trim()) {
      toast.error("Topic name cannot be empty");
      return;
    }
    try {
      await updateTopic({ id, name: newTopicName }).unwrap();
      toast.success("Topic renamed successfully");
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update topic");
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick} // Navigate on card click
        className="
          group relative p-6
          bg-gray-100
          rounded-xl
          flex items-center justify-center
          min-h-[8rem]
          font-semibold
          text-lg
          text-gray-800
          cursor-pointer
          transform hover:scale-[1.02] transition-all duration-150
          border border-gray-200
          hover:bg-gray-50
          [box-shadow:5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff,inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#bebebe]
        "
      >
        <span className="text-center group-hover:text-blue-600 transition-colors">
          {topicName}
        </span>

        {/* Action Buttons (Visible on Hover) */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigating to the topic page
              setShowEditModal(true);
            }}
            className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:text-blue-600 transition-colors shadow-sm"
          >
            <Edit3 size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents navigating to the topic page
              setShowDeleteModal(true);
            }}
            className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:text-red-600 transition-colors shadow-sm"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* ======================= DELETE MODAL ========================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[30px] p-8 max-w-sm w-full shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertTriangle size={28} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Topic?</h2>
            <p className="text-gray-500 text-center mt-2 mb-6 text-sm">
              Removing <strong>"{topicName}"</strong> will not delete the journals inside, but they will be un-categorized.
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 flex justify-center items-center">
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= EDIT MODAL ========================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[30px] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Rename Topic</h2>
            <input
              type="text"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all mb-6"
              autoFocus
              onClick={(e) => e.stopPropagation()} // Prevent focus from bubbling
            />
            <div className="flex gap-3 w-full">
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={isUpdating} className="flex-1 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 flex justify-center items-center">
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopicCard;