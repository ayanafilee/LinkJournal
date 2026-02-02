'use client';

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useGetUserProfileQuery, useUpdateProfilePictureMutation } from '@/store/api/apiSlice';
import { uploadToCloudinary } from '@/app/actions/upload';
import {
  Camera, Loader2, Mail, User as UserIcon,
  Calendar, ShieldCheck, ArrowLeft, Image as ImageIcon,
  Settings, LogOut, ExternalLink, Award
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/clientApp';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: user, isLoading: isFetching } = useGetUserProfileQuery();
  const [updateProfilePic, { isLoading: isUpdatingDB }] = useUpdateProfilePictureMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedFile) return;
    try {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append('file', selectedFile);
      const cloudinaryUrl = (await uploadToCloudinary(uploadData)) as string;

      await updateProfilePic({ profile_picture: cloudinaryUrl }).unwrap();

      toast.success("Profile picture updated!");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      toast.error('Failed to update profile.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (!mounted || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const isPending = isUploading || isUpdatingDB;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all font-semibold">
            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600"><Settings size={20} /></button>
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 font-bold text-sm px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Profile Status (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm text-center lg:text-left">
              <div className="relative inline-block lg:block mx-auto">
                <div className="h-32 w-32 lg:h-40 lg:w-40 rounded-[40px] border-[6px] border-white shadow-xl overflow-hidden bg-slate-100 mx-auto lg:mx-0">
                  <img
                    src={previewUrl || user?.profile_picture || "/profile-placeholder.png"}
                    alt="Profile"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <label className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-all cursor-pointer rounded-[34px]">
                    <Camera className="text-white mb-2" size={32} />
                    <span className="text-white text-[10px] font-bold uppercase">Update Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {user?.display_name || 'Journaler'}
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-1">{user?.email}</p>
              </div>

              {selectedFile && (
                <div className="mt-6 flex flex-col gap-2">
                  <button
                    onClick={handleUpdateImage}
                    disabled={isPending}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center justify-center gap-2"
                  >
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                    Save Changes
                  </button>
                  <button
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="w-full py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Account Type</span>
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold text-[10px] uppercase flex items-center gap-1">
                    <Award size={12} /> Pro
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 font-medium">Status</span>
                  <span className="text-green-600 font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-lg shadow-blue-100 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={120} />
              </div>
              <h3 className="font-bold text-lg mb-2">Privacy Check</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">Your data is encrypted and secure. You have full control over your visibility.</p>
              <button className="bg-white/20 hover:bg-white/30 transition-colors w-full py-2.5 rounded-xl font-bold text-sm">
                Review Security
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Details (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 lg:p-12 shadow-sm">
              <div className="mb-10">
                <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Personal Information</h3>
                <p className="text-slate-400 text-sm">Your private details are only visible to you.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoField
                  icon={<UserIcon className="text-blue-500" size={20} />}
                  label="Full Identity"
                  value={user?.display_name || 'Not set'}
                />
                <InfoField
                  icon={<Mail className="text-blue-500" size={20} />}
                  label="Contact Email"
                  value={user?.email || 'N/A'}
                />
                <InfoField
                  icon={<Calendar className="text-blue-500" size={20} />}
                  label="Member Since"
                  value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Dec 2025'}
                />
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timezone</p>
                    <p className="font-bold text-slate-700 italic">UTC +3:00</p>
                  </div>
                  <ExternalLink size={16} className="text-slate-300" />
                </div>
              </div>

              <div className="mt-16 pt-10 border-t border-slate-100">
                <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-6">Danger Zone</h3>
                <div className="bg-red-50/50 rounded-3xl p-6 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-red-900">Delete Account</h4>
                    <p className="text-xs text-red-600/70 font-medium">This action is permanent and cannot be undone.</p>
                  </div>
                  <button className="px-6 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl font-black text-xs hover:bg-red-50 transition-all uppercase tracking-wider">
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

function InfoField({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="group relative">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-blue-50 group-hover:bg-blue-600 transition-colors group-hover:text-white text-blue-600">
          {/* We cast to React.ReactElement to tell TS that this 
                        specific element can accept the 'size' property 
                    */}
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 18 })
            : icon
          }
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="pl-12">
        <p className="text-lg font-bold text-slate-800 break-words">{value}</p>
      </div>
    </div>
  );
}