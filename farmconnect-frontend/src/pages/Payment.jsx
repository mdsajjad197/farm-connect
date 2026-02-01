import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { Loader2, Banknote, MapPin, Phone, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "../component/Navbar";

export default function Payment() {
    const { cart, clearCart, fetchCart, loading: cartLoading } = useContext(CartContext);
    const navigate = useNavigate();
    const [submitLoading, setSubmitLoading] = useState(false);

    // Address State
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [landmark, setLandmark] = useState("");
    const [phone, setPhone] = useState("");

    const safeCart = Array.isArray(cart) ? cart : [];

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await api.get("/user/profile");
                if (res.data) {
                    setAddress(res.data.address || "");
                    setCity(res.data.city || "");
                    setPhone(res.data.phone || "");
                }
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            }
        };
        fetchUserProfile();
    }, []);

    const itemsTotal = safeCart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
    const DELIVERY_CHARGE = 60;
    const totalAmount = itemsTotal + DELIVERY_CHARGE;

    const handleCOD = async () => {
        if (!address || !city || !phone) {
            alert("Please fill in Address, City, and Phone Number");
            return;
        }

        setSubmitLoading(true);
        try {
            await api.post("/user/checkout", {
                paymentMethod: "COD",
                shippingAddress: { address, city, landmark, phone }
            });
            await clearCart();
            await fetchCart();
            navigate("/order/my-orders");
        } catch (err) {
            alert("Order failed: " + (err.response?.data?.message || err.message));
        } finally {
            setSubmitLoading(false);
        }
    };

    if (cartLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-green-50">
                <Loader2 className="animate-spin text-green-600" size={48} />
            </div>
        );
    }

    if (safeCart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <Navbar />
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <ShoppingBag className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                    <p className="text-gray-500">Add some fresh produce to get started!</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="mt-4 px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-green-200"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
            <Navbar />

            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-10 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-lime-300/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2 flex items-center gap-3">
                    Secure Checkout <ShieldCheck className="text-green-600 inline-block" size={32} />
                </h1>
                <p className="text-gray-600 mb-10 text-lg">Review your details and complete your purchase.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Shipping & Payment */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* SHIPPING DETAILS CARD */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600"><MapPin size={20} /></div>
                                Shipping Details
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Delivery Address</label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full p-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Enter your full street address"
                                        rows="3"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            className="w-full p-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                                            placeholder="City Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Landmark (Optional)</label>
                                        <input
                                            type="text"
                                            value={landmark}
                                            onChange={(e) => setLandmark(e.target.value)}
                                            className="w-full p-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                                            placeholder="E.g. Near Park"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-12 p-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all font-mono text-lg"
                                            placeholder="98765 43210"
                                        />
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Phone size={20} /></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PAYMENT METHOD CARD */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600"><Banknote size={20} /></div>
                                Payment Method
                            </h2>

                            <div className="p-5 rounded-2xl border-2 border-green-500 bg-green-50/50 flex items-center gap-4 transition-all duration-300 mb-6">
                                <div className="p-3 rounded-full bg-green-100 text-green-600">
                                    <Banknote size={24} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold text-lg text-green-900">Cash on Delivery</span>
                                    <span className="text-xs text-gray-500 font-medium">Pay when you receive</span>
                                </div>
                                <div className="ml-auto text-green-500"><ShieldCheck size={24} /></div>
                            </div>

                            <button
                                onClick={handleCOD}
                                disabled={submitLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-black py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-green-200 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none bg-[position:0%_0%] hover:bg-[position:100%_0%] bg-[image:linear-gradient(to_right,var(--tw-gradient-stops))]"
                            >
                                {submitLoading ? <Loader2 className="animate-spin" /> : <>Place Order using COD <ArrowRight size={20} /></>}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-xl">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                                    Order Summary
                                    <span className="ml-auto bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{safeCart.length} Items</span>
                                </h3>

                                <div className="space-y-4 mb-6 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                    {safeCart.map(item => (
                                        <div key={item.cartItemId || item._id} className="flex justify-between items-center group">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-1">{item.name || "Unknown Item"}</p>
                                                <p className="text-xs text-gray-500 font-medium tracking-wide">
                                                    Qty: <span className="text-gray-700">{item.qty}</span> × ₹{item.price}
                                                </p>
                                            </div>
                                            <span className="font-bold text-gray-900">₹{(item.price || 0) * (item.qty || 1)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-dashed border-gray-300 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>Subtotal</span>
                                        <span>₹{itemsTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 font-medium">
                                        <span>Delivery Charge</span>
                                        <span>₹{DELIVERY_CHARGE}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-900 border-dashed">
                                        <span className="text-lg font-bold text-gray-800">Total</span>
                                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">₹{totalAmount}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50/80 backdrop-blur-sm p-4 rounded-2xl border border-green-100 flex items-start gap-4">
                                <div className="bg-white p-2 rounded-full shadow-sm text-green-600 shrink-0">
                                    <ShieldCheck size={20} />
                                </div>
                                <p className="text-xs text-green-800 leading-relaxed font-medium">
                                    We protect your personal information with 256-bit SSL encryption.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
