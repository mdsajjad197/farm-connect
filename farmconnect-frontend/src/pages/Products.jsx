import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Search, Snowflake, ArrowRight } from "lucide-react";

import ProductCard from "../component/ProductCard";
import Navbar from "../component/Navbar";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const { cart } = useCart();


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/user/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => {
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  if (loading) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <div className="text-green-800 font-medium animate-pulse">Loading fresh products...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* PROMO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-800 shadow-xl mb-12 p-8 md:p-12 text-white">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white/10 skew-x-12 translate-x-12 blur-3xl"></div>
          <div className="absolute left-0 bottom-0 h-32 w-32 bg-yellow-400/20 rounded-full blur-2xl"></div>

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold mb-4 border border-white/30">
              <Snowflake size={14} className="inline mr-1" /> Winter Season Special
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Fresh from the Farm <br />
              <span className="text-green-200">Straight to your Table.</span>
            </h1>
            <p className="text-lg text-green-100 mb-8 max-w-lg">
              Get flat 20% off on all seasonal vegetables this week. Support local farmers and eat healthy!
            </p>
            <button className="bg-white text-green-800 px-8 py-3 rounded-xl font-bold hover:bg-green-50 transition shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2">
              Shop Now <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* HEADER & CONTROLS */}
        <div className="flex flex-col md:flex-row justify-end items-center mb-8 gap-4">
          <Link
            to="/cart"
            className="group bg-white hover:bg-green-50 border border-green-100 text-green-800 px-6 py-3 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative">
              <ShoppingBag size={22} className="text-green-600 group-hover:scale-110 transition-transform" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                  {cart.length}
                </span>
              )}
            </div>
            <span className="font-bold">My Cart</span>
          </Link>
        </div>

        {/* SEARCH & FILTERS CONTAINER */}
        <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/50 mb-10 transition-all">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* SEARCH */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search for vegetables, fruits..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* SORT */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 min-w-[150px]">
              <span className="text-xs font-bold text-gray-400 uppercase">Sort</span>
              <select
                className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-700 font-bold cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price_low">Price: Low</option>
                <option value="price_high">Price: High</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-green-50 p-6 rounded-full mb-4">
              <Search size={48} className="text-green-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search.</p>
            <button
              onClick={() => { setSearchTerm(""); }}
              className="mt-4 text-green-600 font-bold hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pb-12">
            {filteredProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
