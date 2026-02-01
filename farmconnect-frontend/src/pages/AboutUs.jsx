import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Leaf, Users, ShieldCheck, Truck, TrendingUp, Award, Heart, Sprout } from 'lucide-react';
import Navbar from "../component/Navbar";

export default function AboutUs() {
    const { t } = useTranslation();

    const stats = [
        { label: t('about.stats.farmers'), value: "500+", icon: <Users size={24} className="text-green-600" /> },
        { label: t('about.stats.products'), value: "1200+", icon: <Sprout size={24} className="text-green-600" /> },
        { label: t('about.stats.customers'), value: "10k+", icon: <Heart size={24} className="text-green-600" /> },
        { label: t('about.stats.years'), value: "5+", icon: <Award size={24} className="text-green-600" /> },
    ];

    const features = [
        { title: t('about.fresh'), desc: t('about.freshDesc'), icon: <Leaf size={28} className="text-white" />, color: "bg-green-500" },
        { title: t('about.fair'), desc: t('about.fairDesc'), icon: <TrendingUp size={28} className="text-white" />, color: "bg-blue-500" },
        { title: t('about.local'), desc: t('about.localDesc'), icon: <Truck size={28} className="text-white" />, color: "bg-orange-500" },
        { title: t('about.quality'), desc: t('about.qualityDesc'), icon: <ShieldCheck size={28} className="text-white" />, color: "bg-purple-500" },
    ];

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar />
            {/* Hero Section with Glassmorphism */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 py-24 pb-32">
                {/* Animated Background Blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-300/20 rounded-full blur-3xl animate-blob opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl animate-blob animation-delay-4000 opacity-60"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-green-700 text-sm font-bold mb-6 shadow-sm uppercase tracking-wider animate-fade-in-up">
                        About FarmConnect
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                        Cultivating <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Trust</span>, <br className="hidden md:block" />
                        Harvesting <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Freshness</span>.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                        {t('about.heroSubtitle')}
                    </p>
                </div>
            </div>

            {/* Stats Section - Floating Glass Card */}
            <div className="max-w-7xl mx-auto px-4 -mt-24 relative z-20 mb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center p-6 bg-white/50 rounded-2xl hover:bg-green-50/50 transition-all duration-300 group">
                            <div className="flex justify-center mb-4 bg-white w-16 h-16 mx-auto rounded-full items-center shadow-md group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl font-extrabold text-gray-800 mb-1 group-hover:text-green-700 transition-colors">{stat.value}</h3>
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="max-w-7xl mx-auto px-4 mb-24">
                <div className="grid md:grid-cols-5 gap-12 items-start">
                    {/* Mission Card */}
                    <div className="md:col-span-3 bg-gradient-to-br from-gray-50 to-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-green-100 rounded-xl text-green-600">
                                    <Leaf size={28} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">{t('about.missionTitle')}</h2>
                            </div>

                            <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                                {t('about.missionText')}
                            </p>
                            <div className="text-gray-600 leading-relaxed text-lg border-l-4 border-green-500 pl-6 italic bg-green-50/50 py-4 pr-4 rounded-r-xl">
                                <Trans i18nKey="about.intro" components={{ 1: <span className="font-bold text-green-700 not-italic" /> }} />
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="md:col-span-2 grid gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-5 p-6 rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-xl hover:shadow-green-100 transition-all duration-300 hover:-translate-y-1 group">
                                <div className={`${feature.color} p-4 rounded-2xl shadow-lg shrink-0 text-white group-hover:rotate-6 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
