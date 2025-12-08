"use client";

import { useState } from "react";
import { sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("");
  
  // Validation State
  const [emailError, setEmailError] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);

  // --- Validation Logic ---

  const validateEmail = (email: string) => {
    // Simple regex for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);

    // Validate while writing
    if (val.length > 0 && !validateEmail(val)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  // --- Reset Logic ---

  const handlePasswordReset = async () => {
    // 1. Basic Form Check
    if (!email || emailError) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // 2. Check if the user exists in Firebase
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length === 0) {
        // If the email is NOT found, show the required error
        toast.error("User didn't register. No account found with this email.");
        setLoading(false);
        return;
      }
      
      // 3. If the user exists, send the reset email
      await sendPasswordResetEmail(auth, email);
      
      // 4. Redirect to the success page
      // Assuming you want a page to tell them to check their email
      router.push(`/check-email?email=${encodeURIComponent(email)}&type=reset`);

    } catch (err: any) {
      // Catch any unexpected Firebase errors
      console.error("Password reset error:", err);
      toast.error("An error occurred. Please try again later.");
    }

    setLoading(false);
  };

  const isFormValid = email && !emailError;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F9FD] px-4 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-[500px] bg-white p-8 md:p-10 rounded-xl shadow-sm">
        
        {/* Header (Matches your "Forgot Password.png") */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Forgot Password
        </h1>

        <p className="text-center text-gray-500 mb-6">
            Enter your email to receive a password reset link.
        </p>

        {/* Email Field (Matches Signup/Login styling) */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            E-mail <span className="text-red-500">*</span>
          </label>
          <div className="relative">
             {/* Mail Icon */}
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <input
                type="email"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm transition-colors ${
                  emailError 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-200 focus:ring-blue-500"
                }`}
                placeholder="Your Email"
                value={email}
                onChange={handleEmailChange}
            />
          </div>
          {/* Validation Error Text */}
          {emailError && (
            <p className="text-red-500 text-xs mt-1">{emailError}</p>
          )}
        </div>

        {/* Continue Button (Matches your "Forgot Password.png") */}
        <button
          onClick={handlePasswordReset}
          disabled={loading || !isFormValid}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mb-6 shadow-sm shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending link..." : "Continue"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link href="/signup">
            <span className="text-blue-600 font-medium cursor-pointer hover:underline">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}