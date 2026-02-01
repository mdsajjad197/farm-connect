import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import HeroCarousel from "../component/HeroCarousel";
import InfiniteMarquee from "../component/InfiniteMarquee";
import StatsSection from "../component/StatsSection";
import Testimonials from "../component/Testimonials";
import NewsCarousel from "../component/NewsCarousel";
import ProductCard from "../component/ProductCard";
import Footer from "../component/Footer";
import api from "../api/axios";

import Services from "./Services";
import { useTranslation } from "react-i18next";

export default function Home() {
  const [products, setProducts] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/user/products");
        setProducts(res.data.slice(0, 5));
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchProducts();
  }, []);



  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroCarousel />
      <InfiniteMarquee />
      <Services />

      {/* Featured Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 w-full">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{t('home.featured')}</h2>
          <Link to="/products" className="text-green-600 font-semibold hover:underline">{t('home.viewAll')} &rarr;</Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>

      <NewsCarousel />
      <Testimonials />
      <StatsSection />
      <Footer />
    </div>
  );
}
