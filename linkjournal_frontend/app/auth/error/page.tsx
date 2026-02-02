"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") || "An authentication error occurred";

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F9FD] px-4 font-sans">
      <div className="w-full max-w-[500px] bg-white p-8 md:p-10 rounded-xl shadow-sm text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Authentication Error
        </h1>
        
        <p className="text-gray-600 mb-8">{message}</p>
        
        <div className="flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Login
          </Link>
          <Link
            href="/auth/signup"
            className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-[#F8F9FD]">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  );
}
