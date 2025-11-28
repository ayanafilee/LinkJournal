"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/clientApp";

export default function SignupPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);

  // Show/hide password toggles
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleSignup = async () => {
    setShowPasswordError(true);

    if (password !== confirmPassword) {
      setMessage("");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Signup successful!");
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  const passwordMismatch =
    showPasswordError && password && confirmPassword && password !== confirmPassword;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">

        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-2">
          Sign up
        </h1>

        <p className="text-center text-gray-700 font-medium mb-8">
          Mark as Important
        </p>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-[#C2C2C2] placeholder:text-[#C2C2C2]"
              placeholder="Your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 text-sm py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-[#C2C2C2] placeholder:text-[#C2C2C2]"
              placeholder="Your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-[#C2C2C2] placeholder:text-[#C2C2C2]"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
            Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-[#C2C2C2] placeholder:text-[#C2C2C2] ${
                passwordMismatch ? "border-red-500" : ""
              }`}
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "🙈" : "👁️"}
            </span>
          </div>

          {passwordMismatch && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
            Confirm Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type={showConfirmPass ? "text" : "password"}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 text-[#C2C2C2] placeholder:text-[#C2C2C2] ${
                passwordMismatch ? "border-red-500" : ""
              }`}
              placeholder="Your Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
            >
              {showConfirmPass ? "🙈" : "👁️"}
            </span>
          </div>

          {passwordMismatch && (
            <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
          )}
        </div>

        <p className="text-xs text-gray-600 mb-4">
          By signing up you agree to our{" "}
          <span className="text-blue-600 cursor-pointer">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
        </p>

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium mb-4"
        >
          Continue
        </button>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or continue with</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button className="p-3 rounded-full border hover:bg-gray-100">
            <img src="/icons/facebook.svg" className="w-6" />
          </button>
          <button className="p-3 rounded-full border hover:bg-gray-100">
            <img src="/icons/google.svg" className="w-6" />
          </button>
        </div>

        <p className="text-center text-sm">
          Already signed up?{" "}
          <span className="text-blue-600 cursor-pointer">Login</span>
        </p>

        {message && (
          <p className="text-center text-red-600 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}
