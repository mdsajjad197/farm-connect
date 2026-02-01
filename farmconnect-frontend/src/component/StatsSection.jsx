import React from 'react';
import { Users, ShoppingBag, Smile, Calendar } from 'lucide-react';

const stats = [
    { id: 1, name: 'Active Farmers', value: '500+', icon: Users },
    { id: 2, name: 'Products Sold', value: '10k+', icon: ShoppingBag },
    { id: 3, name: 'Happy Customers', value: '25k+', icon: Smile },
    { id: 4, name: 'Years of Service', value: '5+', icon: Calendar },
];

export default function StatsSection() {
    return (
        <div className="relative py-24 bg-gray-900 border-t border-green-800/30">
            {/* Background Image with Fixed/Parallax effect */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-10"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=2574&auto=format&fit=crop")' }}
            ></div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/40"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-base font-bold text-green-400 tracking-wide uppercase">Our Impact</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                        Growing Together Community
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
                        Connecting local farmers with the community, creating a sustainable ecosystem for everyone.
                    </p>
                </div>

                <dl className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item) => (
                        <div key={item.id} className="flex flex-col items-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <div className="p-3 bg-green-500/10 rounded-full mb-4">
                                <item.icon className="h-8 w-8 text-green-400" aria-hidden="true" />
                            </div>
                            <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-300">
                                {item.name}
                            </dt>
                            <dd className="order-1 text-5xl font-extrabold text-white tracking-tight">
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    );
}
