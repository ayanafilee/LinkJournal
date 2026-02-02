"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useSignupUserMutation } from "@/store/api/apiSlice";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [signupUser] = useSignupUserMutation(); // Added this
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Error States
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // UI State
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // --- Validation Helpers ---
  const validateEmailFormat = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    let isValid = true;

    // First Name
    if (!firstName.trim()) {
      setFirstNameError("First name is required.");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    // Last Name
    if (!lastName.trim()) {
      setLastNameError("Last name is required.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    // Email
    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!validateEmailFormat(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password
    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 chars.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    // Confirm Password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  // --- Handler ---
// --- OAuth Signup ---
  const handleOAuthSignup = async (provider: 'google' | 'facebook') => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast.error(`Failed to sign up with ${provider === 'google' ? 'Google' : 'Facebook'}`);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setLoading(true);
    let userCredential; // Define outside to use in catch if needed

    try {
      // 1. Create User in Firebase
      userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      try {
        // 2. Sync with MongoDB (Nested try-catch to handle DB failure specifically)
        await signupUser({
          firebase_uid: userCredential.user.uid,
          email: userCredential.user.email!,
          display_name: `${firstName} ${lastName}`,
          profile_picture: "", 
        }).unwrap();
      } catch (dbError) {
        // IF DATABASE FAILS: Delete the firebase user so they can try again
        await userCredential.user.delete();
        throw new Error("Database sync failed. Please try again.");
      }

      // 3. Send Verification Email
      await sendEmailVerification(userCredential.user);

      toast.success("Account created! Redirecting...", { duration: 2000 });

      setTimeout(() => {
        router.push("/");
      }, 1500);

    } catch (err: any) {
      // Handles both Firebase errors and our custom Database error
      const errorCode = err.code;

      if (errorCode === 'auth/email-already-in-use') {
        setEmailError("This email is already in use.");
        toast.error("Email already registered.");
      } else {
        toast.error(err.message || "Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8F9FD] px-4 font-sans">
      
      {/* Toast Configuration */}
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

      <div className="w-full max-w-[500px] bg-white p-8 md:p-10 rounded-xl shadow-sm">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Sign up
        </h1>

        {/* Name Fields */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm ${
                firstNameError 
                  ? "border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:ring-blue-500"
              }`}
              placeholder="Your First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (e.target.value) setFirstNameError(""); 
              }}
            />
            {firstNameError && <p className="text-red-500 text-xs mt-1">{firstNameError}</p>}
          </div>

          <div className="w-1/2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm ${
                lastNameError 
                  ? "border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:ring-blue-500"
              }`}
              placeholder="Your Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (e.target.value) setLastNameError("");
              }}
            />
            {lastNameError && <p className="text-red-500 text-xs mt-1">{lastNameError}</p>}
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            E-mail <span className="text-red-500">*</span>
          </label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <input
                type="email"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm ${
                    emailError 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-200 focus:ring-blue-500"
                }`}
                placeholder="Your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) setEmailError("");
                }}
            />
          </div>
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>

            <input
              type={showPass ? "text" : "password"}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm transition-colors ${
                passwordError 
                  ? "border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:ring-blue-500"
              }`}
              placeholder="Your Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value) setPasswordError("");
              }}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              )}
            </button>
          </div>
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Confirm Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>

            <input
              type={showConfirmPass ? "text" : "password"}
              className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-gray-700 placeholder-gray-400 text-sm transition-colors ${
                confirmPasswordError 
                  ? "border-red-500 focus:ring-red-200" 
                  : "border-gray-200 focus:ring-blue-500"
              }`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (e.target.value) setConfirmPasswordError("");
              }}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? (
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
              )}
            </button>
          </div>
          {confirmPasswordError && <p className="text-red-500 text-xs mt-1">{confirmPasswordError}</p>}
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          By signing up you agree to our{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>.
        </p>

        {/* Continue Button */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors mb-6 shadow-sm shadow-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Continue"}
        </button>

        {/* OR Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-3 text-gray-400 text-xs font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => handleOAuthSignup('facebook')}
            className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Sign up with Facebook"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          
          <button 
            onClick={() => handleOAuthSignup('google')}
            className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            aria-label="Sign up with Google"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Already signed up ?{" "}
           <Link href="./login">
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">Login</span>
          </Link>
        </p>

      </div>
    </div>
  );
}
