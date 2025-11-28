"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { FiMail } from "react-icons/fi";
import { LuEye, LuEyeOff, LuLock } from "react-icons/lu";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful!");

      // Redirect after success
      setTimeout(() => {
        router.push("/");
      }, 700);

    } catch (err: any) {
      setMessage("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-sm">

        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Login
        </h1>

        {/* Email */}
        <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
          E-mail <span className="text-red-500">*</span>
        </label>

        <div className="relative mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full px-3 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500 placeholder:text-[#C2C2C2]"
          />
          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        {/* Password */}
        <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
          Password <span className="text-red-500">*</span>
        </label>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your Password"
            className="w-full px-3 py-2 pl-10 pr-10 border rounded-md focus:ring-2 focus:ring-blue-500 placeholder:text-[#C2C2C2]"
          />

          <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <LuEyeOff /> : <LuEye />}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm mb-3 ${
              message.includes("successful")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium mb-4 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
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
          Don’t have an account?{" "}
          <span className="text-blue-600 cursor-pointer">Sign Up</span>
        </p>
      </div>
    </div>
  );
}
