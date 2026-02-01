import React from 'react';
import { Truck, ShoppingBasket, ShieldCheck, Users, ArrowRight, Zap, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from "../component/Navbar";

export default function Services() {
    const { t } = useTranslation();

    const services = [
        {
            id: 'marketplace',
            icon: ShoppingBasket,
            color: 'bg-green-500',
            bgGradient: 'from-green-50 to-emerald-50',
            span: 'md:col-span-2',
            title: t('services.marketplace'),
            description: t('services.marketplaceDesc')
        },
        {
            id: 'delivery',
            icon: Truck,
            color: 'bg-blue-500',
            bgGradient: 'from-blue-50 to-indigo-50',
            span: 'md:col-span-1',
            title: t('services.delivery'),
            description: t('services.deliveryDesc')
        },
        {
            id: 'quality',
            icon: ShieldCheck,
            color: 'bg-purple-500',
            bgGradient: 'from-purple-50 to-fuchsia-50',
            span: 'md:col-span-1',
            title: t('services.qualityAssurance'),
            description: t('services.qualityDesc')
        },
        {
            id: 'support',
            icon: Users,
            color: 'bg-orange-500',
            bgGradient: 'from-orange-50 to-amber-50',
            span: 'md:col-span-2',
            title: t('services.support'),
            description: t('services.supportDesc')
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-20">
                {/* Header */}
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-bold uppercase tracking-widest shadow-sm">
                        <Star size={14} className="fill-green-700" /> Our Services
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        Everything You Need to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Grow & Connect</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        We provide the digital infrastructure to bridge the gap between hard-working farmers and conscious consumers.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`
                                relative group overflow-hidden rounded-[2.5rem] p-10
                                bg-gradient-to-br ${service.bgGradient}
                                ${service.span}
                                border border-white/60 shadow-lg hover:shadow-2xl
                                transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01]
                                flex flex-col items-start
                            `}
                        >
                            {/* Decorative Background Blob */}
                            <div className={`absolute -right-12 -bottom-12 w-64 h-64 bg-white/60 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-70`}></div>

                            <div className="relative z-10 flex flex-col h-full items-start w-full">
                                {/* Icon Container */}
                                <div className={`p-4 rounded-2xl ${service.color} text-white mb-6 shadow-lg shadow-black/5 group-hover:rotate-6 transition-transform duration-300 ring-4 ring-white/80`}>
                                    <service.icon size={32} />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-800 transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed mb-8 flex-grow font-medium text-lg">
                                    {service.description}
                                </p>

                                <button className="mt-auto flex items-center gap-3 font-bold text-gray-800 group-hover:gap-5 transition-all group-hover:text-green-700 bg-white/50 hover:bg-white px-5 py-2.5 rounded-xl backdrop-blur-sm border border-white/50 shadow-sm">
                                    Learn more <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="mt-24 bg-gray-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-3xl mix-blend-overlay"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl mix-blend-overlay"></div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-md mb-4 border border-white/10">
                            <Zap size={32} className="text-yellow-400 fill-yellow-400" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold">Ready to support local agriculture?</h2>
                        <p className="text-xl text-gray-300">Join thousands of happy customers and farmers making a difference today.</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-500 hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300"
                        >
                            Get Started Now
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
