import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User, ArrowRight } from 'lucide-react';

const stories = [
    {
        id: 1,
        category: "Success Story",
        title: "How Raman's Organic Farm Tripled Yields",
        excerpt: "Adopting sustainable irrigation practices helped this local farmer save water and grow more.",
        date: "Oct 12, 2025",
        author: "S. Kumar",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        category: "New Tech",
        title: "Drone Technology on Small Farms",
        excerpt: "Using drones for crop monitoring is becoming affordable for small-scale farmers in the region.",
        date: "Oct 08, 2025",
        author: "Tech Team",
        image: "https://images.unsplash.com/photo-1624720114708-0cbd6ee41f4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fERyb25lJTIwVGVjaG5vbG9neSUyMG9uJTIwU21hbGwlMjBGYXJtc3xlbnwwfHwwfHx8MA%3D%3D"
    },
    {
        id: 3,
        category: "Community",
        title: "Weekly Farmers Market: A Big Hit!",
        excerpt: "The new Sunday market initiative has connected over 200 consumers directly with producers.",
        date: "Sep 25, 2025",
        author: "Community Lead",
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 4,
        category: "Tips & Tricks",
        title: "Best Practices for Storing Root Veggies",
        excerpt: "Keep your carrots and potatoes fresh for months with these simple storage hacks.",
        date: "Sep 15, 2025",
        author: "Chef Anita",
        image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=1974&auto=format&fit=crop"
    },
    {
        id: 5,
        category: "Innovation",
        title: "Solar Powered Cold Storage Units",
        excerpt: "Reducing post-harvest losses with new solar-powered micro-cold storage units.",
        date: "Sep 01, 2025",
        author: "Green Energy",
        image: "https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?q=80&w=2072&auto=format&fit=crop"
    },
];

export default function NewsCarousel() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 400;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="py-16 bg-gradient-to-br from-green-50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <span className="text-green-600 font-bold uppercase tracking-wider text-sm">From the Field</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">News & Stories</h2>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full border border-gray-300 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full border border-gray-300 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {stories.map((story) => (
                        <div
                            key={story.id}
                            className="min-w-[300px] md:min-w-[350px] snap-center bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full border border-gray-100"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 uppercase tracking-wide">
                                    {story.category}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                                    {story.title}
                                </h3>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                                    {story.excerpt}
                                </p>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
