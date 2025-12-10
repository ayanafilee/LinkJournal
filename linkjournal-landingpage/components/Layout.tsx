// components/Layout.tsx

"use client";

import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import for Next.js App Router
import { ArrowUp, Menu } from 'lucide-react';

// =================================================================
// Configuration & Utilities
// =================================================================

// Utility function to render the LinkJournal Logo/Branding
const renderLogo = () => (
    <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-[#C5A365] rounded-full flex items-center justify-center text-[#C5A365] font-serif font-bold text-lg md:text-xl relative">
            LJ
            <span className="absolute -right-1 h-full w-[1px] bg-[#C5A365]"></span>
        </div>
        <div className="flex flex-col leading-none">
            <span className="font-bold text-base md:text-lg text-[#C5A365]">Link</span>
            <span className="text-xs md:text-sm text-[#C5A365]">journal</span>
        </div>
    </div>
);

// Define the navigation links for ease of maintenance
const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How it Works' },
    { href: '/about', label: 'About' },
];

interface LayoutProps {
    children: React.ReactNode;
}

// =================================================================
// Main Component
// =================================================================

export default function Layout({ children }: LayoutProps) {
    const pathname = usePathname();

    // State for header visibility on scroll
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // State for mobile menu visibility
    const [mobileOpen, setMobileOpen] = useState(false);
    
    // Ref for the header container to detect outside clicks
    const headerRef = useRef<HTMLElement>(null);

    // --- Active Link Logic ---
    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    const linkBaseClass = "font-medium transition-colors";
    // Active style includes blue text and a bottom border for desktop emphasis
    const activeClass = "text-blue-600 border-b-2 border-blue-600 pb-1"; 
    const inactiveClass = "text-gray-800 hover:text-blue-600"; 
    
    // --- Effect for Scroll Hiding Header ---
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setShowHeader(false);
                    setMobileOpen(false); // Close mobile menu when scrolling down
                } else {
                    setShowHeader(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);


    // --- Effect for Click Outside to Close Mobile Menu ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the menu is open AND the click target is NOT inside the header
            if (mobileOpen && headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setMobileOpen(false);
            }
        };

        // Attach listener only when the mobile menu is open
        if (mobileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener when the component unmounts or state changes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [mobileOpen]);


    return (
        <div className="min-h-screen bg-[#F3F5F7] font-sans text-gray-800">
            <Head>
                <title>LinkJournal - Organize Your Links</title>
                <meta name="description" content="Save, Describe, and Organize the Links That Matter to You" />
            </Head>

            {/* ================= HEADER ================= */}
            <header
                ref={headerRef} 
                className={`fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md transition-transform duration-300 shadow-sm
                    ${showHeader ? "translate-y-0" : "-translate-y-full"}
                `}
            >
                <div className="w-full py-6 px-4 md:px-8 flex justify-between items-center">

                    {/* Left Side: Mobile Menu + Logo */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Icon */}
                        <button
                            className="md:hidden text-gray-800"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                        >
                            <Menu />
                        </button>

                        {/* Logo */}
                        {renderLogo()}
                    </div>

                    {/* Right Side: Nav + Join Button */}
                    <div className="flex items-center gap-8">
                        {/* DESKTOP NAV */}
                        <nav className="hidden md:flex items-center gap-8 text-lg">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.href}
                                    href={link.href} 
                                    className={`${linkBaseClass} ${isActive(link.href) ? activeClass : inactiveClass}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Join Button - Visible on Mobile and Desktop */}
                        <button className="bg-[#2B61E3] hover:bg-blue-700 text-white font-semibold py-2 px-4 text-sm md:text-base md:px-6 rounded-full transition-colors">
                            Join Now
                        </button>
                    </div>
                </div>

                {/* ========== MOBILE MENU DROPDOWN ========== */}
                {mobileOpen && (
                    <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-100 shadow-lg p-6 space-y-4 text-lg font-medium absolute w-full left-0 top-full">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.href}
                                href={link.href} 
                                className={`block ${isActive(link.href) ? activeClass.replace('border-b-2', 'border-l-4 pl-2') : 'text-gray-900 hover:text-blue-600'}`}
                                onClick={() => setMobileOpen(false)} // Closes menu when a link is clicked
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </header>

            {/* Content Buffer & Main Content */}
            <div className="h-24"></div> {/* Buffer space equal to header height */}
            <main>{children}</main>

            {/* ================= FOOTER ================= */}
            <footer className="bg-[#0D131F] text-white py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Column 1: Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold">LinkJournal</h2>
                        <div className="text-gray-400 text-sm space-y-1">
                            <p>Your Personal Knowledge Archiving Platform</p>
                            <p>Turning your saved links into lasting personal wisdom.</p>
                        </div>

                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="mt-8 flex items-center gap-2 px-6 py-2 border border-gray-500 rounded text-sm hover:bg-gray-800 transition-colors"
                        >
                            <ArrowUp size={16} fill="currentColor" />
                            Back to top
                        </button>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-[#4FA1F3]">
                            <li><Link href="/" className="hover:underline">Home</Link></li>
                            <li><Link href="/about" className="hover:underline">About</Link></li>
                            <li><Link href="/features" className="hover:underline">Features</Link></li>
                            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                            <li><Link href="/faqs" className="hover:underline">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm text-[#4FA1F3]">
                            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                            <li><Link href="/guide" className="hover:underline">User Guide</Link></li>
                            <li><Link href="/docs" className="hover:underline">Developer Docs</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-gray-800 text-center md:text-left text-sm text-gray-400 font-bold">
                    © 2025 LinkJournal. All rights reserved.
                </div>
            </footer>
        </div>
    );
}