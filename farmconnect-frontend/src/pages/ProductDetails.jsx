
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, User, MapPin, Tag, Star, Truck, ShieldCheck } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart, cart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/user/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                console.error("Failed to load product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const success = await addToCart(id, 1);
        if (success) {
            alert("Added to cart");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
            <div className="text-2xl font-bold text-green-700 animate-pulse">Loading amazing products...</div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
            <div className="text-xl text-gray-600 bg-white/50 px-8 py-4 rounded-xl backdrop-blur-md border border-white/60 shadow-lg">
                Product not found
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Navigation Header */}
                <div className="flex justify-between items-center mb-8">
                    <Link
                        to="/products"
                        className="group inline-flex items-center text-gray-600 hover:text-green-700 transition-colors duration-200"
                    >
                        <div className="bg-white/80 p-2 rounded-full shadow-sm group-hover:shadow-md mr-3 transition-all duration-200 border border-white/60 backdrop-blur-sm">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-medium">Back to Products</span>
                    </Link>

                    <Link
                        to="/cart"
                        className="relative group bg-white/60 hover:bg-white/90 backdrop-blur-md border border-white/50 text-green-800 px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <ShoppingCart size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Cart</span>
                        <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1 shadow-sm">
                            {cart.length}
                        </span>
                    </Link>
                </div>

                {/* Main Product Card */}
                <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 overflow-hidden lg:grid lg:grid-cols-2 gap-0 relative">

                    {/* Image Section */}
                    <div className="relative h-96 lg:h-auto bg-gradient-to-b from-gray-50 to-gray-100/50 flex items-center justify-center p-8 overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-200/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <img
                            src={product.image?.startsWith("http") ? product.image : `https://farm-connect-sand.vercel.app/${product.image}`}
                            alt={product.name}
                            className="w-full h-full object-contain max-h-[500px] drop-shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out z-10"
                        />
                        <div className="absolute top-6 left-6 z-20">
                            <span className="bg-white/90 backdrop-blur border border-green-100 text-green-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                Fresh Harvest
                            </span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 lg:p-12 flex flex-col justify-between relative">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                        {product.name}
                                    </h1>
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill="currentColor" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500 font-medium">(4.8/5 Reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-baseline gap-2">
                                <span className="text-5xl font-bold text-green-700">₹{product.price}</span>
                                <span className="text-lg text-gray-500 font-medium flex items-center">
                                    / per kg
                                    {/* <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold">-10% OFF</span> */}
                                </span>
                            </div>

                            <div className="mt-8 space-y-6">
                                <p className="text-lg text-gray-700 leading-relaxed font-light">
                                    {product.description || "Directly from the farm to your table. Grown with care and sustainable practices to ensure the highest quality and freshness."}
                                </p>

                                {/* Features Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                            <Truck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Delivery</p>
                                            <p className="text-sm font-semibold text-gray-900">Next Day</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/50 p-4 rounded-xl border border-white/60 shadow-sm flex items-center gap-3">
                                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Quality</p>
                                            <p className="text-sm font-semibold text-gray-900">Guaranteed</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Seller Info Card */}
                                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex items-center justify-between group cursor-pointer hover:bg-green-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white p-3 rounded-full shadow-md text-green-600 border border-green-50">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase">Sold by Farmer</p>
                                            <Link to={`/seller/${product.consumerId._id}`} className="text-lg font-bold text-gray-900 hover:text-green-700">
                                                {product.consumerId.name}
                                            </Link>
                                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                                                <MapPin size={14} />
                                                {product.consumerId.city}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowLeft size={20} className="rotate-180" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="mt-10 pt-8 border-t border-gray-100/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Tag size={18} />
                                    <span className="font-medium">Stock Status:</span>
                                </div>
                                <span className={`font-bold px-3 py-1 rounded-full text-sm ${product.quantity > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}>
                                    {product.quantity > 0 ? `${product.quantity} Units Available` : "Out of Stock"}
                                </span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.quantity <= 0}
                                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform flex items-center justify-center gap-3 shadow-xl ${product.quantity > 0
                                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-green-300 active:scale-[0.98]"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                                    }`}
                            >
                                <ShoppingCart size={24} />
                                {product.quantity > 0 ? "Add to Your Cart" : "Currently Unavailable"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
