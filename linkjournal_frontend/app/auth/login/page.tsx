"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSignupUserMutation } from "@/store/api/apiSlice";
import { handleError, handleSuccess } from "@/lib/errorHandler";

export default function LoginPage() {
  const router = useRouter();
  const [signupUser] = useSignupUserMutation();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation State
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Validation Logic ---
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (val.length > 0 && !validateEmail(val)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length > 0 && val.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
    } else {
      setPasswordError("");
    }
  };

  // --- Login Logic ---
  const handleLogin = async () => {
    // 1. Basic validation
    if (emailError || passwordError) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // 2. Attempt Firebase Login
      await signInWithEmailAndPassword(auth, email, password);

      // Success Toast
      toast.success("Login successful! Redirecting...", {
        duration: 2000,
      });

      // 3. Redirect after 1.5 seconds
      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  // --- OAuth Login ---
  const handleOAuthLogin = async (providerName: 'google' | 'facebook') => {
    if (loading) return; // Guard: Prevent multiple simultaneous requests
    setLoading(true);

    let provider;
    if (providerName === 'google') {
      provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
    } else {
      provider = new FacebookAuthProvider();
      provider.addScope('email');
      provider.addScope('public_profile');
    }

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sync with MongoDB (in case they haven't signed up yet)
      try {
        await signupUser({
          firebase_uid: user.uid,
          email: user.email!,
          display_name: user.displayName || "User",
          profile_picture: user.photoURL || "",
        }).unwrap();
        handleSuccess(`Logged in with ${providerName === 'google' ? 'Google' : 'Facebook'}!`);
      } catch (dbError: any) {
        if (dbError.status === 409) {
          handleSuccess(`Logged in with ${providerName === 'google' ? 'Google' : 'Facebook'}!`);
        } else {
          handleError(dbError, "Authenticated with Firebase, but failed to sync our database.");
        }
      }

      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (err: any) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] font-sans">
      {/* Sidebar Image - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop"
          alt="Workspace"
          className="absolute inset-0 object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex flex-col justify-end p-16">
          <div className="mb-4">
            <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center text-white font-serif font-bold text-xl mb-4">
              LJ
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            The Digital Home for Your Curated Wisdom
          </h2>
          <p className="text-xl text-blue-50/90 max-w-md leading-relaxed">
            LinkJournal helps you capture, organize, and transform your bookmarked links into a personal library of insights.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-white px-4 md:px-12 py-8">
        {/* Mobile Logo Only */}
        <div className="lg:hidden mb-6 flex flex-col items-center">
          <div className="w-10 h-10 border-2 border-blue-600 rounded-full flex items-center justify-center text-blue-600 font-serif font-bold text-lg mb-1">
            LJ
          </div>
          <span className="text-[#C5A365] font-serif font-bold text-sm">LinkJournal</span>
        </div>

        {/* Premium Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-6 text-lg font-bold text-gray-900 tracking-tight">Verifying Identity...</p>
              <p className="text-sm text-gray-500 font-medium">Please wait while we secure your session</p>
            </div>
          </div>
        )}

        {/* Toast Configuration: Top Right */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />

        <div className="w-full max-w-[400px]">
          {/* Header */}
          <div className="text-center md:text-left mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              Welcome Back
            </h1>
            <p className="text-gray-500">Log in to your personal archive</p>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <input
                type="email"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm transition-all ${emailError
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
                  }`}
                placeholder="name@example.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            {emailError && (
              <p className="text-red-500 text-[11px] mt-1 leading-tight">{emailError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <Link href="./forgot-password">
                <span className="text-blue-600 text-xs font-medium cursor-pointer hover:underline">Forgot?</span>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>

              <input
                type={showPassword ? "text" : "password"}
                className={`w-full pl-11 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm transition-all ${passwordError
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
                  }`}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />

              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-[11px] mt-1 leading-tight">{passwordError}</p>
            )}
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading || !isFormValid}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all mb-4 shadow-lg shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
          >
            {loading ? "Logging in..." : "Login to Workspace"}
          </button>

          {/* OR Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="px-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest">social login</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              className="w-full h-12 flex items-center justify-center rounded-xl border border-gray-100 opacity-40 cursor-not-allowed bg-gray-50/50"
              title="Facebook login is currently unavailable"
              disabled
            >
              <svg className="w-5 h-5 grayscale mr-2" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-xs font-bold text-gray-400">Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className={`w-full h-12 flex items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:border-gray-200'}`}
              aria-label="Sign in with Google"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-xs font-bold text-gray-700">Google</span>
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500">
            Don’t have an account?{" "}
            <Link href="./signup">
              <span className="text-blue-600 font-extrabold cursor-pointer hover:underline ml-1">Create an account</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
