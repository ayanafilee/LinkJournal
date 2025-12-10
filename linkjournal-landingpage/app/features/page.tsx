// app/features/page.tsx (or wherever your Features page resides)

"use client";

import Link from 'next/link';
// Import icons needed for the features from lucide-react
import { BookOpenText, Tags, Star, Search, Bell } from 'lucide-react';

// NOTE: The Header, Footer, and all related state/effects (showHeader, lastScrollY, mobileOpen, useEffect)
// have been removed, as they now live in the RootLayout/Layout component.

export default function FeaturesPage() {
  return (
    // The main structure and background color should be defined in the Layout component,
    // but we keep the font-sans text-gray-800 for consistent styling of the content.
    <>
      {/* ================= HERO SECTION - Features Page Header ================= */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-20 text-center">
        <span className="text-sm font-semibold text-[#C5A365] uppercase tracking-widest">Core Functionality</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mt-4">
          Organize, Reflect, and Retrieve Your Personal Knowledge
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          LinkJournal goes beyond simple bookmarking. We provide powerful tools for lifelong learners and professionals to transform collected web links into lasting personal wisdom.
        </p>
      </section>

      {/* ================= 3 COLUMN FEATURE GRID: Archiving & Organization (US-004, US-005) ================= */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Structured Knowledge Archiving
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Feature 1: Journal Entry (US-005) */}
          <div className="space-y-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <BookOpenText className="text-[#2B61E3] w-10 h-10" />
            <h3 className="text-2xl font-bold text-gray-900">Deep Link Journaling</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Capture the context of your discovery. Each LinkJournal entry allows you to save the <span className='font-bold'>URL, a custom name, a screenshot, and a detailed description/reflection</span>. This ensures that the *why* behind the link is preserved, turning information into meaningful personal insight.
            </p>
          </div>

          {/* Feature 2: Topic & Tag Management (US-004) */}
          <div className="space-y-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <Tags className="text-[#C5A365] w-10 h-10" />
            <h3 className="text-2xl font-bold text-gray-900">Flexible Topic Organization</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Organize your links with unparalleled flexibility. <span className='font-bold'>Create custom topics</span> (e.g., 'React Tutorials', 'Quantum Physics Research') or use predefined categories. This structured approach makes navigation effortless, allowing you to instantly focus on specific areas of knowledge.
            </p>
          </div>

          {/* Feature 3: Visual Previews (US-005 Screenshot) */}
          <div className="space-y-4 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <BookOpenText className="text-[#2B61E3] w-10 h-10" />
            <h3 className="text-2xl font-bold text-gray-900">Visual Link Archiving</h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Enhance memory recall with visuals. Upload an optional <span className='font-bold'>screenshot</span> for every LinkJournal entry. Instead of relying solely on text, quickly recognize your saved resources through visual cues, turning your archive into a beautiful, scannable gallery.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 2 COLUMN FEATURE: Retrieval (US-012) ================= */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center bg-white/50 rounded-xl p-8 md:p-12 shadow-inner">
        {/* Text Side (Order 1 on Mobile, 2 on Desktop) */}
        <div className="order-1 md:order-1 space-y-6">
          <Search className="text-[#2B61E3] w-12 h-12" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Instant Search & Filtering</h2>
          <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
            <p className="font-semibold">
              <span className="text-[#2B61E3] font-bold">US-012:</span> Find anything, instantly.
            </p>
            <p>
              Our powerful, intelligent search engine quickly indexes your entire archive—including the link name, the full description/reflection, and all associated topics. No more losing links!
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Keyword Search: Locate journals by any word used in the title or description.</li>
              <li>Topic Filtering: Narrow your view to only show links under a specific category.</li>
              <li>Importance Filter: Quickly toggle to view only your most crucial, <span className='font-bold'>Marked as Important</span> links.</li>
            </ul>
          </div>
        </div>

        {/* Image Side (Order 2 on Mobile, 1 on Desktop) */}
        <div className="order-2 md:order-2 w-full rounded-lg overflow-hidden shadow-2xl">
          {/* Using a conceptual image for search/data retrieval */}
          <img
            src="/conceptual/search-image.png" // Placeholder image source
            alt="Conceptual image of intelligent search interface"
            className="w-full h-auto object-cover bg-gray-300"
          />
        </div>
      </section>

      {/* ================= 2 COLUMN FEATURE: Prioritization & Engagement (US-008, US-014) ================= */}
      <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image Side */}
        <div className="w-full rounded-lg overflow-hidden shadow-2xl">
          {/* Using a conceptual image for prioritization/reminders */}
          <img
            src="/conceptual/prioritization-image.png" // Placeholder image source
            alt="Conceptual image of reminder and star icons for important links"
            className="w-full h-auto object-cover bg-gray-300"
          />
        </div>

        {/* Text Side */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Star className="text-[#C5A365] w-12 h-12" />
            <Bell className="text-[#2B61E3] w-12 h-12" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Prioritize & Revisit for Retention</h2>
          <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
            <p>
              LinkJournal is your digital memory companion, not just a storage system. We encourage active learning and knowledge retention with features designed to keep your most valuable resources top-of-mind.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>
                <span className="font-bold text-[#C5A365]">Mark as Important (US-008, US-009):</span> Instantly flag your key resources with a star. Access them all on a dedicated <span className='font-bold'>Important Journals Page</span> for zero-friction retrieval.
              </li>
              <li>
                <span className="font-bold text-[#2B61E3]">Optional Reminders (US-014):</span> Activate a reminder system that gently prompts you to revisit older or important links. <span className='font-bold'>Foster deeper learning</span> by engaging with your saved wisdom over time.
              </li>
              <li>
                <span className="font-bold text-gray-900">Edit & Delete (US-010, US-011):</span> Easily maintain a clean archive by updating old information or removing outdated links.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA SECTION - Consistent with LandingPage Style ================= */}
      <section className="bg-[#E4E9EC] py-16 md:py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to Transform Your Learning?
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
          Stop losing links and start building a lasting library of personal wisdom.
        </p>
        <Link href="/signup">
          <button className="bg-[#2B61E3] hover:bg-blue-700 text-white font-bold text-xl py-3 px-10 rounded-full shadow-xl transition-transform hover:scale-105">
            Get Started with LinkJournal
          </button>
        </Link>
      </section>
    </>
  );
}