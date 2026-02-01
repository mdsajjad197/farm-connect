import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Package, MapPin, Calendar, ShoppingBag, Truck, Eye, Trash2, X, User, Phone } from "lucide-react";
import api from "../api/axios";
import Navbar from "../component/Navbar";
import { useTranslation } from "react-i18next";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showClearOptions, setShowClearOptions] = useState(false);
    const [selectedOrderForShipping, setSelectedOrderForShipping] = useState(null);
    const [user, setUser] = useState(null); // To fallback address info if needed
    const { t } = useTranslation();

    useEffect(() => {
        fetchOrders();
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res = await api.get("/user/profile");
            setUser(res.data);
        } catch (err) {
            console.error("Failed to load user for fallback address", err);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await api.get("/user/my-orders");
            // Filter and Sort
            const activeOrders = res.data
                .filter(order => {
                    const s = order.status?.toUpperCase();
                    return s !== 'DELIVERED' && s !== 'CANCEL' && s !== 'CANCELLED';
                })
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(activeOrders);
        } catch (err) {
            console.error("Error fetching orders", err);
            setError("Failed to load your orders.");
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async (status = null) => {
        const message = status
            ? `Are you sure you want to clear ALL ${status} orders?`
            : "Are you sure you want to clear ALL completed orders?";

        if (!window.confirm(message)) return;

        try {
            const url = status
                ? `/user/orders/history?status=${status}`
                : "/user/orders/history";

            await api.delete(url);
            fetchOrders();
            setShowClearOptions(false);
            alert("Order history updated!");
        } catch (err) {
            console.error("Error clearing history", err);
            alert("Failed to clear history.");
        }
    };

    const handleHideOrder = async (orderId) => {
        if (!window.confirm("Hide this order from your history?")) return;
        try {
            await api.put(`/user/order/${orderId}/hide`);
            fetchOrders();
        } catch (err) {
            console.error("Error hiding order", err);
            alert("Failed to hide order.");
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'process': case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-green-600" size={48} />
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <Navbar />

            {/* HEADER */}
            <div className="relative h-64 bg-gradient-to-r from-green-600 to-emerald-500 overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                        <h1 className="text-4xl font-extrabold mb-2">{t('orders.title')}</h1>
                        <p className="text-green-50 text-lg opacity-90">{t('orders.subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto p-4 md:p-8 -mt-16 relative z-10">

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <ShoppingBag className="text-green-600" /> Active Orders
                        </h2>
                    </div>
                    {orders.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={() => setShowClearOptions(!showClearOptions)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-red-100 flex items-center gap-2"
                            >
                                <Trash2 size={16} /> {t('orders.clearHistory')}
                            </button>
                            {showClearOptions && (
                                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-48 z-10 animate-in fade-in zoom-in-95 duration-200">
                                    <button onClick={() => handleClearHistory("DELIVERED")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">{t('orders.clearDelivered')}</button>
                                    <button onClick={() => handleClearHistory("CANCEL")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">{t('orders.clearCancelled')}</button>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button onClick={() => handleClearHistory()} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 font-medium">{t('orders.clearAll')}</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                {orders.length === 0 && !error ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center animate-fade-in-up">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-green-600" size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{t('orders.noOrders')}</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">{t('orders.noOrdersDesc')}</p>
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                        >
                            {t('orders.startShopping')}
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order, index) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                {/* Order Header */}
                                <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center text-sm">
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span className="font-semibold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Truck size={14} className="text-gray-400" />
                                            <span className="font-mono text-gray-600">ID: {order._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border tracking-wide ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </div>
                                        {["DELIVERED", "CANCEL", "CANCELLED"].includes(order.status) && (
                                            <button
                                                onClick={() => handleHideOrder(order._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="Hide this order"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                        {/* Image */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-200">
                                            <Package className="text-gray-300" size={32} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{order.productId?.name || t('orders.unavailable')}</h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{order.productId?.description}</p>

                                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 font-medium">{t('orders.qty')}: {order.quantity}</span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 font-medium">{t('orders.seller')}: {order.consumerId?.name || "Unknown"}</span>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-green-50 text-green-700 font-medium">Total: ₹{order.totalPrice}</span>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                            <button
                                                onClick={() => setSelectedOrderForShipping(order)}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-green-200 text-green-600 bg-green-50 text-sm font-bold rounded-lg hover:bg-green-100 transition-all"
                                            >
                                                <Eye size={16} /> View Shipping Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Shipping Details Modal */}
            {selectedOrderForShipping && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-green-50 p-6 flex justify-between items-center border-b border-green-100">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Truck size={20} className="text-green-600" /> Shipping Details
                            </h3>
                            <button
                                onClick={() => setSelectedOrderForShipping(null)}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-white/50 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="mt-1 bg-white p-2 rounded-full shadow-sm">
                                    <MapPin size={24} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
                                    <p className="font-semibold text-gray-900 text-base">{selectedOrderForShipping.shippingAddress?.address || user?.address || "Address not provided"}</p>
                                    <p className="text-gray-600">{selectedOrderForShipping.shippingAddress?.city || user?.city}</p>
                                    {selectedOrderForShipping.shippingAddress?.landmark && (
                                        <p className="text-gray-500 text-sm mt-1">Landmark: {selectedOrderForShipping.shippingAddress.landmark}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <User size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Receiver Name</p>
                                    <p className="font-semibold text-gray-900">{user?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <Phone size={24} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Number</p>
                                    <p className="font-semibold text-gray-900 font-mono tracking-wide">{selectedOrderForShipping.shippingAddress?.phone || user?.phone || "Not provided"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                            <button
                                onClick={() => setSelectedOrderForShipping(null)}
                                className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
}
