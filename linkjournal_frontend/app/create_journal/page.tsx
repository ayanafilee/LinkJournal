'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useGetTopicsQuery, useCreateJournalMutation } from '@/store/api/apiSlice';
import {
  Bold, Italic, List, ListOrdered, Smile, CloudUpload,
  Search, ChevronDown, Link as LinkIcon, Loader2
} from 'lucide-react';
import { uploadToCloudinary } from '@/app/actions/upload';
import { handleError, handleSuccess, handleWarning } from '@/lib/errorHandler';

export default function AddNewLink() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Queries & Mutations
  const { data: topics = [] } = useGetTopicsQuery();
  const [createJournal, { isLoading: isCreating }] = useCreateJournalMutation();

  // Form State
  const [formData, setFormData] = useState({
    topicId: '',
    name: '',
    url: '',
    description: '',
    photo: null as File | null,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Ensure component is mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter topics for dropdown search
  const filteredTopics = useMemo(() => {
    return topics.filter(t =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [topics, searchTerm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.topicId || !formData.name || !formData.url || !formData.photo) {
      handleWarning("Please fill in all required fields.");
      return;
    }

    try {
      setIsUploading(true);

      const uploadData = new FormData();
      uploadData.append('file', formData.photo);
      const cloudinaryUrl = (await uploadToCloudinary(uploadData)) as string;

      await createJournal({
        topic_id: formData.topicId,
        name: formData.name,
        link: formData.url,
        description: formData.description,
        screenshot: cloudinaryUrl,
      }).unwrap();

      handleSuccess("Journal created successfully!");

      setFormData({ topicId: '', name: '', url: '', description: '', photo: null });
      setSearchTerm('');

      setTimeout(() => {
        router.push('/journals');
      }, 2000);

    } catch (error) {
      handleError(error, 'Failed to create the journal.');
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isUploading || isCreating;

  // Render nothing or a skeleton until mounted to ensure hydration matches
  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#F8F9FA] py-12 px-4">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E9ECEF] rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 space-y-12"
        >
          {/* TOPIC SELECTION */}
          <section className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#212529] tracking-tight">Select topic</h2>
              <p className="text-[#6C757D] text-sm mt-1 font-medium">Choose where this link belongs</p>
            </div>

            <div className="relative max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-[#ADB5BD] group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search or select topic..."
                className="w-full pl-11 pr-10 py-3.5 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-[#495057]"
                value={searchTerm}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-[#ADB5BD]" />
              </div>

              {showDropdown && filteredTopics.length > 0 && (
                <ul className="absolute z-20 w-full mt-2 bg-white border border-[#E9ECEF] rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                  {filteredTopics.map((topic) => (
                    <li
                      key={topic.id}
                      className="px-5 py-3.5 hover:bg-[#F8F9FA] cursor-pointer text-[#495057] font-medium transition-colors flex items-center justify-between group border-b border-[#F8F9FA] last:border-none"
                      onClick={() => {
                        setSearchTerm(topic.name);
                        setFormData({ ...formData, topicId: topic.id });
                        setShowDropdown(false);
                      }}
                    >
                      {topic.name}
                      <span className="opacity-0 group-hover:opacity-100 text-blue-500 text-[10px] font-bold uppercase tracking-widest">Select</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* NAME SECTION */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            <label className="text-xl font-bold text-[#212529] md:w-64">Link name</label>
            <div className="flex-1">
              <input
                type="text"
                maxLength={50}
                value={formData.name}
                placeholder="Give your link a clear title..."
                className="w-full border-b border-[#DEE2E6] py-2 text-lg outline-none focus:border-blue-500 transition-all placeholder:text-[#CED4DA] font-medium bg-transparent"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] font-bold text-[#ADB5BD]">
                  {formData.name.length}/50
                </span>
              </div>
            </div>
          </div>

          {/* URL SECTION */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            <div className="flex items-center gap-2 md:w-64">
              <label className="text-xl font-bold text-[#212529]">URL</label>
              <LinkIcon size={18} className="text-[#ADB5BD]" />
            </div>
            <input
              type="url"
              value={formData.url}
              placeholder="https://example.com/useful-article"
              className="flex-1 bg-[#F8F9FA] border border-[#DEE2E6] rounded-xl p-4 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all text-blue-600 font-medium"
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          {/* DESCRIPTION SECTION */}
          <div className="space-y-4">
            <label className="text-xl font-bold text-[#212529]">Description</label>
            <div className="border border-[#DEE2E6] rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-400 transition-all">
              <textarea
                className="w-full h-40 p-6 outline-none resize-none text-[#495057] leading-relaxed placeholder:text-[#CED4DA]"
                placeholder="Why is this link important? Add your notes here..."
                maxLength={500}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <div className="flex items-center justify-between p-4 bg-[#F8F9FA] border-t border-[#E9ECEF]">
                <div className="flex gap-5 text-[#ADB5BD]">
                  <Smile size={20} className="cursor-pointer hover:text-blue-500" />
                  <div className="w-[1px] h-5 bg-[#DEE2E6]" />
                  <Bold size={20} className="cursor-pointer hover:text-blue-500" />
                  <Italic size={20} className="cursor-pointer hover:text-blue-500" />
                  <ListOrdered size={20} className="cursor-pointer hover:text-blue-500" />
                  <List size={20} className="cursor-pointer hover:text-blue-500" />
                </div>
                <span className="text-[10px] font-bold text-[#ADB5BD]">
                  {formData.description.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* UPLOAD SECTION */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#212529]">Cover photo</h3>
              <p className="text-[#6C757D] text-sm font-medium">Add a visual bookmark for this link</p>
            </div>

            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-[#DEE2E6] rounded-3xl bg-[#F8F9FA] cursor-pointer hover:bg-white hover:border-blue-300 transition-all group">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform border border-[#E9ECEF]">
                  <CloudUpload className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-md font-bold text-[#495057]">
                  {formData.photo ? 'Change photo' : 'Drop photo or click to browse'}
                </p>
                {formData.photo && (
                  <div className="mt-2 px-4 py-1.5 bg-green-50 text-green-600 text-[11px] font-bold rounded-full border border-green-100">
                    ✓ {formData.photo.name}
                  </div>
                )}
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          {/* ACTION BUTTON */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#007BFF] hover:bg-[#0056B3] disabled:bg-[#B0D4FF] text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center gap-3"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {isUploading ? 'Uploading Image...' : 'Saving...'}
                </>
              ) : (
                'Create Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}