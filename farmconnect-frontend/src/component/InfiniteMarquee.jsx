import React from 'react';
import { Leaf, Award, Sun, Truck, ShieldCheck, Heart } from 'lucide-react';

const marqueeItems = [
    { text: "100% Organic", icon: Leaf },
    { text: "Farm to Table", icon: Truck },
    { text: "Sustainable Farming", icon: Heart },
    { text: "Fresh Harvest", icon: Sun },
    { text: "Quality Guaranteed", icon: Award },
    { text: "Verified Farmers", icon: ShieldCheck },
];

export default function InfiniteMarquee() {
    return (
        <div className="relative w-full overflow-hidden bg-green-900 border-y border-green-800 py-4">
            {/* Gradient masks for smooth fade edges */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-green-900 to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-green-900 to-transparent z-10"></div>

            <div className="flex w-max animate-marquee">
                {/* First copy of items */}
                <div className="flex items-center gap-12 px-6">
                    {marqueeItems.map((item, index) => (
                        <div key={`orig-${index}`} className="flex items-center gap-3 text-green-100 font-bold text-lg uppercase tracking-wider whitespace-nowrap">
                            <item.icon size={24} className="text-green-400" />
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Second copy for seamless loop */}
                <div className="flex items-center gap-12 px-6">
                    {marqueeItems.map((item, index) => (
                        <div key={`copy-1-${index}`} className="flex items-center gap-3 text-green-100 font-bold text-lg uppercase tracking-wider whitespace-nowrap">
                            <item.icon size={24} className="text-green-400" />
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* Third copy to ensure smoothness on wide screens */}
                <div className="flex items-center gap-12 px-6">
                    {marqueeItems.map((item, index) => (
                        <div key={`copy-2-${index}`} className="flex items-center gap-3 text-green-100 font-bold text-lg uppercase tracking-wider whitespace-nowrap">
                            <item.icon size={24} className="text-green-400" />
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
