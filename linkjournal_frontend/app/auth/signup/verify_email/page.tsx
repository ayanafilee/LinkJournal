"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase/clientApp";

// 1. The inner component that uses search params
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [resendStatus, setResendStatus] = useState("");

  const openGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  const handleResendCode = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        setResendStatus("Code resent successfully!");
      } catch (error) {
        setResendStatus("Error resending code. Try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F9FD] px-4 font-sans">
      <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-xl shadow-sm text-center">
        
        {/* Heading */}
        <h1 className="text-3xl font-bold text-blue-600 mb-8">
          Check your Email
        </h1>

        {/* Body Text */}
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          We’ve sent a confirmation link to <br />
          <span className="font-semibold text-blue-500">
            {email || "your email address"}
          </span>
          . Make sure you verify using the link given.
        </p>

        {/* Open Gmail Button */}
        <button
          onClick={openGmail}
          className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mb-20 shadow-blue-200 shadow-md"
        >
          Open Gmail
        </button>

        {/* Footer / Resend */}
        <div className="text-sm text-gray-500">
          <p>
            Didn’t receive code?{" "}
            <button 
              onClick={handleResendCode}
              className="text-blue-500 hover:underline font-medium"
            >
              Resend Code
            </button>
          </p>
          {resendStatus && (
            <p className="mt-2 text-green-600 text-xs">{resendStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. The main page component wrapping the content in Suspense
// This is required in Next.js App Router when using useSearchParams
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}