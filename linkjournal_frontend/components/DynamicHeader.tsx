"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link"; // Added Link
import SearchInput from "./SearchInput";
import { useGetUserProfileQuery } from "@/store/api/apiSlice"; // Added Hook

const navLinks = [
  { name: "Links", href: "/", searchContext: "journal" },
  { name: "topic", href: "/topics", searchContext: "topic" },
  { name: "Important Links", href: "/important-journals", searchContext: "important journal" },
];

const linkBaseClass = "font-medium transition-colors";
const activeClass = "text-blue-600 border-b-2 border-blue-600 pb-1";
const inactiveClass = "text-gray-800 hover:text-blue-600";

const DynamicHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentSearchFor, setCurrentSearchFor] = useState("journal");

  // Fetch user data from MongoDB via Redux
  const { data: user, isLoading } = useGetUserProfileQuery();

  useEffect(() => {
    const activeLink = navLinks.find((link) => link.href === pathname);
    if (activeLink) {
      setCurrentSearchFor(activeLink.searchContext);
    }
  }, [pathname]);

  const Logo = () => (
    <Link href="/" className="flex items-center gap-3">
      <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-[#C5A365] rounded-full flex items-center justify-center text-[#C5A365] font-serif font-bold text-xl md:text-2xl relative">
        LJ
        <span className="absolute -right-1 h-full w-[2px] bg-[#C5A365]"></span>
      </div>
      <div className="flex flex-col leading-snug">
        <span className="font-bold text-lg md:text-xl text-[#C5A365]">Link</span>
        <span className="text-sm md:text-base text-[#C5A365]">journal</span>
      </div>
    </Link>
  );

  const UserProfile = () => {
    // Show a skeleton or nothing while loading
    if (isLoading) return <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />;

    return (
      <div className="flex items-center">
        {/* Display name from database */}
        <span className="mr-4 text-gray-700 text-lg font-medium hidden sm:block">
          {user?.display_name || "User"}
        </span>
        
        {/* Link to base page as requested */}
        <Link href="/profile">
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-400 transition-colors cursor-pointer">
            <img
              // Use profile_picture from DB, fallback to placeholder if empty
              src={user?.profile_picture || "/profile-placeholder.png"} 
              alt={user?.display_name || "Profile"}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      </div>
    );
  };

  const handleNavClick = (context: string, href: string) => {
    setCurrentSearchFor(context);
    router.push(href);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-gray-50/80 backdrop-blur-md border-b border-gray-200 pb-6">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Logo />
        <UserProfile />
      </header>

      <div className="flex justify-center mt-6 px-6">
        <SearchInput
          searchFor={currentSearchFor}
          onChange={() => {}}
          onSearch={() => {}}
        />
      </div>

      <nav className="flex justify-center space-x-10 text-xl mt-6">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.searchContext, link.href)}
              className={`${linkBaseClass} ${isActive ? activeClass : inactiveClass}`}
            >
              {link.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DynamicHeader;