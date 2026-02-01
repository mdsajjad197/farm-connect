import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop",
        title: "Fresh from the Farm",
        subtitle: "Experience the taste of nature with our organic produce.",
        badge: "100% Organic"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2070&auto=format&fit=crop",
        title: "Support Local Farmers",
        subtitle: "Connect directly with growers in your community.",
        badge: "Community First"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop",
        title: "Healthy Living",
        subtitle: "Nutritious ingredients for a balanced lifestyle.",
        badge: "Eat Healthy"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=2070&auto=format&fit=crop",
        title: "Seasonal Harvest",
        subtitle: "Get the best crops of the season delivered to you.",
        badge: "Seasonal Best"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1595855709940-5776ee1e9136?q=80&w=2070&auto=format&fit=crop",
        title: "Sustainable Practices",
        subtitle: "Committed to eco-friendly farming for a better future.",
        badge: "Eco-Friendly"
    }
];

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const prevSlide = () => {
        setCurrent(current === 0 ? slides.length - 1 : current - 1);
    };

    const nextSlide = () => {
        setCurrent(current === slides.length - 1 ? 0 : current + 1);
    };

    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-gray-900 group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10" />
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[4000ms]"
                    />

                    {/* Content */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
                        <div className={`transform transition-all duration-1000 ${index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                            <span className="inline-block bg-green-500/20 backdrop-blur-md border border-green-400/30 text-green-100 font-bold px-4 py-1.5 rounded-full text-sm mb-6 uppercase tracking-wider">
                                {slide.badge}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight">
                                {slide.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl mx-auto drop-shadow-md font-light">
                                {slide.subtitle}
                            </p>
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-bold rounded-full shadow-lg hover:bg-green-500 hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300"
                            >
                                {t('hero.browse') || "Shop Now"}
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full border border-white/20 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            >
                <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-3 rounded-full border border-white/20 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            >
                <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current
                                ? "bg-green-500 w-8"
                                : "bg-white/50 hover:bg-white/80"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
