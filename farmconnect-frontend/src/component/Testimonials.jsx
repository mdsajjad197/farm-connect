import React from 'react';
import { Star } from 'lucide-react';

const reviews = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Home Chef",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        text: "The quality of vegetables is unmatched! I love that I can support local farmers directly.",
        stars: 5
    },
    {
        id: 2,
        name: "David Chen",
        role: "Daily Commuter",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        text: "FarmConnect has completely changed how I buy groceries. Fresh, fast, and transparent.",
        stars: 5
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Health Enthusiast",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
        text: "Knowing where my food comes from gives me peace of mind. Highly recommend!",
        stars: 4
    },
    {
        id: 4,
        name: "Michael Chang",
        role: "Local Restaurant Owner",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        text: "We source some of our ingredients here. The freshness makes a huge difference in our dishes.",
        stars: 5
    },
    {
        id: 5,
        name: "Anita Patel",
        role: "Mother of two",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
        text: "My kids actually eat their veggies now because they taste so much better!",
        stars: 5
    },
    {
        id: 6,
        name: "Robert Fox",
        role: "Food Blogger",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        text: "A hidden gem for organic produce lovers. The delivery is always on time.",
        stars: 4
    }
];

const ReviewCard = ({ review }) => (
    <div className="w-[350px] flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow mx-4 group">
        <div className="flex items-center gap-4 mb-4">
            <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-green-100" />
            <div>
                <h4 className="font-bold text-gray-900">{review.name}</h4>
                <p className="text-xs text-gray-500">{review.role}</p>
            </div>
            <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                ))}
            </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed italic">"{review.text}"</p>
    </div>
);

export default function Testimonials() {
    return (
        <div className="py-24 bg-gray-50 overflow-hidden">
            <div className="text-center mb-16 px-4">
                <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Community Love</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4">
                    Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Thousands</span>
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    Join the community that cares about sustainable farming and fresh food.
                </p>
            </div>

            {/* Row 1: Left to Right (Reverse) */}
            <div className="relative mb-8">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

                <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused] items-center">
                    {/* Duplicate list 3 times for seamless infinite scroll */}
                    {[...reviews, ...reviews, ...reviews].map((review, idx) => (
                        <ReviewCard key={`row1-${idx}`} review={review} />
                    ))}
                </div>
            </div>

            {/* Row 2: Right to Left (Normal) */}
            <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

                <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
                    {/* Shift the array slightly for visual variety */}
                    {[...reviews.slice(3), ...reviews, ...reviews.slice(0, 3), ...reviews].map((review, idx) => (
                        <ReviewCard key={`row2-${idx}`} review={review} />
                    ))}
                </div>
            </div>

        </div>
    );
}
