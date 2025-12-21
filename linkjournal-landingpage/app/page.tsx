// app/page.tsx

import Link from 'next/link';

export default function LandingPage() {
    return (
        <>
            {/* The rest of the page is now wrapped by the Layout component */}
            
            {/* ================= HERO SECTION ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        Save, Describe, and Organize the Links That Matter to You
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                        LinkJournal helps you keep all your favorite web links in one organized place. Add descriptions, group them by topic, and mark the most important ones for quick access.<br />
                        Stay focused, save time, and never lose track of the resources that matter most to you.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                    <Link href="https://link-journal-qbth.vercel.app/auth/signup" rel="noopener noreferrer">
                        <button className="bg-[#2B61E3] hover:bg-blue-700 text-white font-semibold py-2 px-4 text-sm md:text-base md:px-6 rounded-full transition-colors">
                            Join Now
                        </button>
                    </Link>
                        <span className="text-gray-600 text-sm mt-2 sm:mt-0">
                            154 people started using it.
                        </span>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative w-full aspect-square md:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
                    <img
                        src="./womentouchingthescreen.png"
                        alt="Futuristic interface with woman touching screen"
                        className="w-full h-full object-cover bg-gray-300"
                    />
                </div>
            </section>

            {/* ================= 3 COLUMN FEATURES ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Feature 1 */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">Smart Link Organization</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">
                            Say goodbye to messy bookmarks! Our Smart Link Organization feature automatically categorizes your saved links by topic, keyword, or custom tags. Whether it's articles, tutorials, videos, or project resources — everything stays neatly grouped and easy to find.<br />
                            You can even create your own folders or tags to organize content in a way that fits your workflow. No more endless scrolling just clean, smart, and effortless organization.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">Mark as Important</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">
                            Keep your most valuable links right where you can reach them. With the Mark as Important feature, you can highlight any saved link to appear instantly on your "Important" page. It's perfect for quick access to your go-to references, frequently used tools, or projects you're currently working on.<br />
                            Never waste time searching for that one crucial link again — your priorities are always just one click away.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">Visual Link Preview</h3>
                        <p className="text-gray-700 leading-relaxed text-sm">
                            Make your browsing experience more visual and intuitive. With Visual Link Preview, you can upload screenshots or let the system generate automatic thumbnails for your saved links. Instantly recognize pages by their visuals without reading long titles or descriptions. It's a smarter, more engaging way to explore your collection — turning your saved links into a gallery of your personal knowledge hub.
                        </p>
                    </div>

                </div>
            </section>

            {/* ================= FEATURE: REMEMBER & ACCESS ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Image Side */}
                <div className="order-2 md:order-1 w-full rounded-lg overflow-hidden shadow-xl">
                    <img
                        src="/remember.png"
                        alt="Man stressed at computer"
                        className="w-full h-auto object-cover bg-gray-800"
                    />
                </div>

                {/* Text Side */}
                <div className="order-1 md:order-2 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Remember & Access Instantly</h2>
                    <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
                        <p>
                            LinkJournal helps you capture, organize, and revisit the websites, articles, and tools that truly matter to you — all in one beautifully simple space.
                        </p>
                        <p>
                            Use smart search to instantly locate what you've saved, or mark your most valuable links as "Important" to access them anytime with a single click. Each link can be tagged, categorized, and even previewed visually, so you'll always know exactly where everything is.
                        </p>
                        <p>
                            Whether you're researching for a project, learning new skills, or planning your next big idea, LinkJournal keeps your digital life clear, structured, and stress-free. No more messy browser bookmarks or lost tabs — just an organized journal of knowledge that grows with you.
                        </p>
                    </div>
                </div>
            </section>

            {/* ================= FEATURE: SAVE TIME ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Text Side */}
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Save Time</h2>
                    <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
                        <p>
                            With LinkJournal, you'll never have to dig through old tabs or forgotten bookmarks again. Save your favorite websites, tools, and resources in just a few clicks — neatly organized and always easy to find.
                        </p>
                        <p>
                            Our Smart Organization system automatically groups your links by topic or tag, while Quick Search helps you instantly locate exactly what you need. Whether you're learning something new, working on a project, or creating something amazing, you can stay focused without losing momentum.
                        </p>
                        <p>
                            No more distractions or wasted time — everything you need is always just one click away, right where you expect it to be.
                        </p>
                    </div>
                </div>

                {/* Image Side */}
                <div className="w-full flex justify-center">
                    <img
                        src="/timesave.jpg"
                        alt="Illustration of time management"
                        className="w-full max-w-md h-auto object-contain"
                    />
                </div>
            </section>

            {/* ================= TESTIMONIALS ================= */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Testimonial 1 */}
                    <div className="bg-transparent p-6 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <img src="/profile.png" alt="Ayana File" className="w-full h-full object-cover bg-gray-300" />
                            </div>
                            <h4 className="font-bold text-gray-900">Ayana File</h4>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            I'm a software engineer, and I deal with countless online links every day — documentation, GitHub repos, Stack Overflow threads, and tutorials. I used to forget many of them and waste time searching again when I needed them. After using LinkJournal, I can easily save, organize, and revisit important links whenever I want. The search feature saves me tons of time and keeps my workflow smooth.
                        </p>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="bg-transparent p-6 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <img src="/someone.png" alt="Yohanis Abate" className="w-full h-full object-cover bg-gray-300" />
                            </div>
                            <h4 className="font-bold text-gray-900">Yohanis Abate</h4>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            As a research student, I go through many online papers, articles, and references daily. It was hard to keep track of everything I read. LinkJournal changed that — now I can store all my research links in one place and find them instantly when writing my reports or studying. It made my research process much more organized and efficient.
                        </p>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="bg-transparent p-6 rounded-lg">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <img src="/profile2.jpg" alt="Mercy Jhon" className="w-full h-full object-cover bg-gray-300" />
                            </div>
                            <h4 className="font-bold text-gray-900">Mercy Jhon</h4>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            I create digital content regularly, which means I deal with lots of resources, inspiration links, and platform dashboards. Before LinkJournal, I often lost track of useful links and wasted time searching for them. Now, I can tag and organize everything neatly and get back to work faster. It's honestly a must-have for any creator managing online content.
                        </p>
                    </div>

                </div>
            </section>
        </>
    );
}