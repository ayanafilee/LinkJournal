// app/about/page.tsx

import Link from 'next/link';
// Icons reflecting core themes: Wisdom, Community, Focus, Archiving, Personal
import { Lightbulb, Users, Focus, BookOpenText, Star } from 'lucide-react';
import PersonaCard from '@/components/PersonaCard';

export default function AboutPage() {
    // Reusable SVG icons for email and LinkedIn (can be replaced by Lucide components if preferred)
    const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    );

    const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
    );

    return (
        <>
            {/* ================= HERO SECTION - About Us Header ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto pt-12 md:pt-20 pb-16 text-center">
                <Lightbulb className="w-12 h-12 text-[#C5A365] mx-auto mb-4" />
                <span className="text-sm font-semibold text-[#2B61E3] uppercase tracking-widest">Our Story & Mission</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mt-4">
                    Turning Information Overload into Personal Wisdom
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mt-6">
                    LinkJournal was born from a simple frustration: the sheer volume of valuable content we encounter online gets lost to messy bookmarks, fleeting notes, and fading memory. We believe knowledge should be permanent, searchable, and meaningful.
                </p>
            </section>

            {/* ================= SECTION 1: OUR CORE MISSION ================= */}
            <section className="bg-white px-4 md:px-8 py-16 md:py-24 shadow-inner">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    
                    {/* Text Side */}
                    <div className="space-y-6">
                        <span className="text-xl font-extrabold text-[#C5A365] flex items-center gap-3">
                            <BookOpenText className="w-6 h-6" /> The LinkJournal Difference
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900">
                            The Quest for Long-Term Knowledge Preservation
                        </h2>
                        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                            <p>
                                We go beyond simple link storage. Our platform is designed as a <span className="font-semibold">digital memory companion</span>. Every feature—from the detailed description box to the topic organization—is built to address your core goals:
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>
                                    <span className="font-semibold">Contextual Capture:</span> We capture not just the URL, but the <span className="font-semibold"></span> behind the save—the personal insight, the lesson learned, or the future application.
                                </li>
                                <li>
                                    <span className="font-semibold">Meaningful Archiving:</span> We ensure resources are structured using flexible topics, guaranteeing you can find them years from now.
                                </li>
                                <li>
                                    <span className="font-semibold">Enhanced Retention:</span> Features like 'Mark as Important' and optional reminders encourage active revisiting, fostering deeper learning and retention.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Image/Conceptual Side */}
                    <div className="w-full rounded-xl overflow-hidden shadow-2xl p-8 bg-[#E4E9EC]">
                        <p className="text-lg font-serif italic text-gray-800 border-l-4 border-[#2B61E3] pl-4">
                            "The internet is an ocean of information. LinkJournal is your personalized net, helping you keep the most valuable catches and catalogue them for future use."
                        </p>
                        <p className="mt-4 text-sm font-medium text-[#C5A365]">
                            — LinkJournal Founding Philosophy
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 2: WHO WE BUILT THIS FOR ================= */}
            <section className="px-4 md:px-8 py-16 md:py-24">
                <div className="max-w-7xl mx-auto text-center mb-12">
                    <Users className="w-8 h-8 text-[#2B61E3] mx-auto mb-3" />
                    <h2 className="text-3xl font-bold text-gray-900">
                        Built for the Lifelong Learner
                    </h2>
                    <p className="text-gray-600 text-base max-w-3xl mx-auto mt-4">
                        While anyone can benefit, LinkJournal provides maximum value for individuals deeply invested in continuous learning and professional development.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Persona Cards remain here */}
                    <PersonaCard title="Lifelong Learners" description="Individuals focused on continuous self-improvement who need to save, reflect on, and organize insights from their diverse online learning journey." icon="📘"/>
                    <PersonaCard title="Developers & Researchers" description="Professionals who frequently find critical documentation, tools, and technical articles that must be preserved in a structured, searchable knowledge base." icon="🔬"/>
                    <PersonaCard title="Students" description="Learners gathering study materials, summarizing complex lessons, and needing a highly organized way to revisit core academic resources during exams and beyond." icon="🎓"/>
                    <PersonaCard title="Knowledge Curators" description="Content creators, educators, or bloggers who maintain a personal, meaningful library of resources for content inspiration and reliable reference." icon="💡"/>
                </div>
            </section>

            {/* ================= SECTION 3: THE FOUNDER'S STORY ================= */}
            <section className="bg-[#E4E9EC] px-4 md:px-8 py-16 md:py-24">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <Star className="w-8 h-8 text-[#C5A365] mx-auto mb-3" />
                    <h2 className="text-3xl font-bold text-gray-900">
                        The Founder's Commitment
                    </h2>
                    <p className="text-gray-600 text-base mt-4">
                        LinkJournal is a passion project built on a personal need, ensuring every detail is tuned for the end-user experience.
                    </p>
                </div>
                
                <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-2xl border-t-4 border-[#2B61E3] flex flex-col md:flex-row items-center gap-8">
                    
                    {/* Founder Card - Updated with Name and Links */}
                    <div className="w-full md:w-1/3 text-center">
                        {/* Profile Picture */}
                        <img
                            src="/profile.png" // <<< Ensure this path is correct
                            alt="LinkJournal Founder Profile"
                            className="w-24 h-24 mx-auto rounded-full object-cover shadow-lg mb-4"
                        />
                        <h4 className="text-xl font-bold text-gray-900">Ayana File Dugasa</h4>
                        <p className="text-sm font-semibold text-[#C5A365] uppercase mb-3">Solo Founder & Developer</p>

                        {/* Contact Links */}
                        <div className="flex justify-center space-x-3 text-gray-600">
                            <a 
                                href="mailto:ayanafiledugasa@gmail.com" // <<< REPLACE with your actual email
                                className="hover:text-[#2B61E3] transition-colors"
                                aria-label="Email Ayana File Dugasa"
                            >
                                <MailIcon />
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/ayanaf/" // <<< REPLACE with your actual LinkedIn URL
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#2B61E3] transition-colors"
                                aria-label="Ayana File Dugasa LinkedIn Profile"
                            >
                                <LinkedinIcon />
                            </a>
                        </div>
                    </div>

                    {/* Personal Story */}
                    <div className="w-full md:w-2/3 text-gray-700 text-base text-left space-y-3">
                        <p>
                            "Like many of our users, I struggled with information overload. I had hundreds of bookmarks and scattered notes, but I couldn't remember <strong>why</strong> I saved any of it. That realization—that context is the key to lasting knowledge—was the spark for LinkJournal."
                        </p>

                        <p>
                            "I built LinkJournal to solve my own problem first. This means the features—from the focus on reflection (description) to the powerful search (US-012)—are designed with genuine user-centricity. It’s a tool built by a learner, for learners."
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 4: DESIGN PHILOSOPHY ================= */}
            <section className="px-4 md:px-8 py-16 md:py-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    
                    {/* Text Side */}
                    <div className="space-y-6">
                        <span className="text-xl font-extrabold text-[#C5A365] flex items-center gap-3">
                            <Focus className="w-6 h-6" /> Our Design Philosophy
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900">
                            Minimalism and Retention First
                        </h2>
                        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                            <p>
                                We believe the best tools get out of your way. Our design principles prioritize clarity, speed, and long-term utility:
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>
                                    <span className="font-semibold">Distraction-Free Interface:</span> A clean design ensures your focus remains on your saved content and personal reflections.
                                </li>
                                <li>
                                    <span className="font-semibold">Cross-Device Accessibility:</span> Secure cloud synchronization means your knowledge is always with you, accessible anywhere, anytime.
                                </li>
                                <li>
                                    <span className="font-semibold">Intuitive Navigation:</span> From onboarding (US-000) to search (US-012), everything is built to be simple, fast, and highly reliable.
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Image/Conceptual Side */}
                    <div className="w-full rounded-xl overflow-hidden shadow-2xl p-8 bg-white text-center">
                        <Focus className="w-10 h-10 text-[#2B61E3] mx-auto mb-3" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Focused Experience</h3>
                        <p className="text-gray-700">
                            Our commitment is to a minimalistic and distraction-free design that promotes focused reflection and creativity, not cognitive overload.
                        </p>
                        <p className="mt-3 text-sm text-gray-500">
                            (See US-003 for the clean 'No Topic' state and US-015 for Dark/Light Mode.)
                        </p>
                    </div>
                </div>
            </section>


            {/* ================= FINAL CTA SECTION ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Ready to Start Building Your Personal Library?
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                    Start your LinkJournal today, and feel the difference of an app built with a deep understanding of the learning journey.
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

