// app/how-it-works/page.tsx

import Link from 'next/link';
// Icons reflect core actions in the user stories
import { FilePlus, Edit3, Search, Star, MessageSquare } from 'lucide-react';

export default function HowItWorksPage() {
    // Placeholder video ID - Replace these with the actual IDs of your uploaded YouTube videos
    const videoIdStep1 = "dQw4w9WgXcQ"; // Placeholder for Capture & Organize Video
    const videoIdStep2 = "gUf19u8G_Qc"; // Placeholder for Prioritize & Maintain Video
    const videoIdStep3 = "2zGEt26i_i8"; // Placeholder for Retrieve & Filter Video

    return (
        <>
            {/* ================= HERO SECTION - How It Works Header ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto pt-12 md:pt-20 pb-16 text-center">
                <span className="text-sm font-semibold text-[#2B61E3] uppercase tracking-widest">Workflow Guide</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mt-4">
                    LinkJournal's Simple Archiving Workflow
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto mt-6">
                    Our process is designed around your needs: Capture, Contextualize, and Retrieve. Here's how you turn links into lasting personal wisdom.
                </p>
            </section>

            {/* ================= STEP 1: CAPTURE AND ORGANIZE (US-005, US-004) - VIDEO EMBED ================= */}
            <section className="bg-white px-4 md:px-8 py-16 md:py-24 shadow-inner">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    
                    {/* Text Side */}
                    <div className="space-y-6">
                        <span className="text-2xl font-extrabold text-[#C5A365] flex items-center gap-2">
                            <FilePlus className="w-8 h-8" /> STEP 1
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900">
                            Create a LinkJournal Entry
                        </h2>
                        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                            <p className="font-semibold text-[#2B61E3]">
                                (Based on US-005 & US-004)
                            </p>
                            <p>
                                Every piece of knowledge starts here. When you find a link you want to remember, you create a new LinkJournal entry with all the necessary context.
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>
                                    <span className="font-semibold">Link & Name:</span> Provide the URL and a custom, meaningful name for the resource.
                                </li>
                                <li>
                                    <span className="font-semibold">Description (Reflection):</span> Write down your personal insights, key takeaways, or the "why" behind saving it. This is crucial for later recall.
                                </li>
                                <li>
                                    <span className="font-semibold">Topic Selection:</span> Categorize it under an existing topic or quickly create a new custom topic (e.g., 'React Hooks', 'History Research').
                                </li>
                                <li>
                                    <span className="font-semibold">Optional Screenshot:</span> Upload a visual reference to aid memory retrieval.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Video Embed Side - Replaces the mockup */}
                    <div className="w-full rounded-lg overflow-hidden shadow-2xl aspect-video">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoIdStep1}?controls=0`}
                            title="LinkJournal Step 1: Capture and Organize"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* ================= STEP 2: PRIORITIZE AND MAINTAIN (US-008, US-009, US-010, US-011) - VIDEO EMBED ================= */}
            <section className="px-4 md:px-8 py-16 md:py-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

                    {/* Video Embed Side - Replaces the mockup and is repositioned for visual flow */}
                    <div className="order-2 md:order-1 w-full rounded-lg overflow-hidden shadow-2xl aspect-video">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoIdStep2}?controls=0`}
                            title="LinkJournal Step 2: Prioritize and Maintain"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Text Side */}
                    <div className="order-1 md:order-2 space-y-6">
                        <span className="text-2xl font-extrabold text-[#C5A365] flex items-center gap-2">
                            <Edit3 className="w-8 h-8" /> STEP 2
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900">
                            Prioritize and Maintain Your Archive
                        </h2>
                        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                            <p>
                                Your knowledge archive is living, not static. Once saved, you have full control over organization and prioritization.
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>
                                    <span className="font-semibold">Flag Importance (US-008):</span> Use the star icon to instantly flag crucial links, making them accessible on the dedicated <span className="font-semibold">Important Journals Page (US-009)</span>.
                                </li>
                                <li>
                                    <span className="font-semibold">Edit Anytime (US-010):</span> Click 'Edit' in the detail view to update the name, link, topic, or description—ensuring your information is always accurate.
                                </li>
                                <li>
                                    <span className="font-semibold">Delete When Needed (US-011):</span> Keep your archive clean by permanently removing outdated or irrelevant entries.
                                </li>
                                <li>
                                    <span className="font-semibold">Revisit Reminders (US-014):</span> Activate the optional reminder system to revisit older entries and reinforce your learning over time.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= STEP 3: RETRIEVE & FILTER (US-012, US-006) - VIDEO EMBED ================= */}
            <section className="bg-[#E4E9EC] px-4 md:px-8 py-16 md:py-24">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    
                    {/* Text Side */}
                    <div className="space-y-6">
                        <span className="text-2xl font-extrabold text-[#C5A365] flex items-center gap-2">
                            <Search className="w-8 h-8" /> STEP 3
                        </span>
                        <h2 className="text-4xl font-bold text-gray-900">
                            Instantly Retrieve Saved Knowledge
                        </h2>
                        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
                            <p className="font-semibold text-[#2B61E3]">
                                (Based on US-012 & US-006)
                            </p>
                            <p>
                                The true value of LinkJournal is finding what you need the moment you need it. Our powerful system uses the context you provided in Step 1.
                            </p>
                            <ul className="list-disc list-inside space-y-2 pl-4">
                                <li>
                                    <span className="font-semibold">Smart Search (US-012):</span> Use the global search bar to locate journals by any keyword used in the <span className="font-semibold">Name, Topic, or Description</span>.
                                </li>
                                <li>
                                    <span className="font-semibold">Topic View (US-006):</span> Simply click a topic in the sidebar to view all related LinkJournals entries, organized neatly.
                                </li>
                                <li>
                                    <span className="font-semibold">Importance Filter (US-012):</span> Filter your results to display only those marked as important to focus on critical resources.
                                </li>
                            </ul>
                            <p className="font-semibold text-[#C5A365]">
                                Stop losing links. Start mastering your collected wisdom.
                            </p>
                        </div>
                    </div>

                    {/* Video Embed Side - Replaces the mockup */}
                    <div className="w-full rounded-lg overflow-hidden shadow-2xl aspect-video">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${videoIdStep3}?controls=0`}
                            title="LinkJournal Step 3: Retrieve and Filter"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* ================= FINAL CTA SECTION ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 text-center">
                <MessageSquare className="w-12 h-12 text-[#C5A365] mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Ready to Start Contextualizing Your Knowledge?
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                    The journey from collecting information to building personal wisdom is just three steps away.
                </p>
                <Link href="/signup">
                    <button className="bg-[#2B61E3] hover:bg-blue-700 text-white font-bold text-xl py-3 px-10 rounded-full shadow-xl transition-transform hover:scale-105">
                        Start Your LinkJournal
                    </button>
                </Link>
            </section>
        </>
    );
}