"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SearchInput from "./SearchInput";

// Navigation links
const navLinks = [
  { name: "Journals", href: "/journals", searchContext: "journal" },
  { name: "topic", href: "/topics", searchContext: "topic" },
  { name: "Important journal", href: "/important-journals", searchContext: "important journal" },
];

// Styles
const linkBaseClass = "font-medium transition-colors";
const activeClass = "text-blue-600 border-b-2 border-blue-600 pb-1";
const inactiveClass = "text-gray-800 hover:text-blue-600";

const DynamicHeader: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [currentSearchFor, setCurrentSearchFor] = useState(
    navLinks[0].searchContext
  );

  const Logo = () => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-[#C5A365] rounded-full flex items-center justify-center text-[#C5A365] font-serif font-bold text-xl md:text-2xl relative">
        LJ
        <span className="absolute -right-1 h-full w-[2px] bg-[#C5A365]"></span>
      </div>
      <div className="flex flex-col leading-snug">
        <span className="font-bold text-lg md:text-xl text-[#C5A365]">
          Link
        </span>
        <span className="text-sm md:text-base text-[#C5A365]">
          journal
        </span>
      </div>
    </div>
  );

  const UserProfile = () => (
    <div className="flex items-center">
      <span className="mr-4 text-gray-700 text-lg">Ayana File</span>
      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-300">
        <img
          src="."
          alt="Ayana Profile"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );

  const handleNavClick = (context: string, href: string | null) => {
    setCurrentSearchFor(context);

    if (href) {
      router.push(href);
    }
  };

  return (
    <div className="bg-gray-50 pb-10">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <Logo />
        <UserProfile />
      </header>

      {/* Search */}
      <div className="flex justify-center mt-8">
        <SearchInput
          searchFor={currentSearchFor}
          onChange={() => {}}
          onSearch={() => {}}
        />
      </div>

      {/* Navigation */}
      <nav className="flex justify-center space-x-10 text-xl mt-6">
        {navLinks.map((link) => {
          const isActive =
            link.href
              ? pathname === link.href
              : currentSearchFor === link.searchContext;

          return (
            <button
              key={link.name}
              onClick={() =>
                handleNavClick(link.searchContext, link.href)
              }
              className={`${linkBaseClass} ${
                isActive ? activeClass : inactiveClass
              }`}
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
