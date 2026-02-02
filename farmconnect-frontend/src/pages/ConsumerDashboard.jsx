import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../component/DashboardLayout";
import api from "../api/axios";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Plus,
    Edit2,
    Trash2,
    X,
    Loader2,
    DollarSign,
    TrendingUp,
    MapPin,
    Phone,
    User,
    CheckCircle,
    Clock,
    AlertCircle,
    MessageSquare
} from "lucide-react";
import DashboardCard from "../component/DashboardCard";
import { toast } from "react-toastify";

export default function ConsumerDashboard() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get("tab") || "overview";

    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        pendingOrders: 0,
    });
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);

    // Modal States
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: "",
        price: "",
        quantity: "",
        harvestDate: "",
        image: null,
    });

    // Profile State
    const [profile, setProfile] = useState({
        _id: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
    });

    // History Options State
    const [showClearOptions, setShowClearOptions] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await api.get("/consumer/profile");
            console.log("Profile Data:", res.data); // Debugging
            setProfile(res.data);
            return res.data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const fetchFeedbacks = async (consumerId) => {
        if (!consumerId) return;
        setLoading(true);
        try {
            const res = await api.get(`/feedback/consumer/${consumerId}`);
            setFeedbacks(res.data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadTab = async () => {
            if (activeTab === "profile") {
                await fetchProfile();
            } else if (activeTab === "inbox") {
                // We need the ID to fetch feedbacks
                let consumerData = profile._id ? profile : await fetchProfile();
                if (consumerData && consumerData._id) {
                    await fetchFeedbacks(consumerData._id);
                }
            } else {
                fetchData();
            }
        };
        loadTab();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsRes, ordersRes] = await Promise.all([
                api.get("/consumer/products"),
                api.get("/consumer/orders"),
            ]);

            setProducts(productsRes.data);
            setOrders(ordersRes.data);

            // Calculate Stats
            const totalSales = ordersRes.data.reduce(
                (acc, order) => acc + (order.totalPrice || 0),
                0
            );
            const pendingOrders = ordersRes.data.filter(
                (o) => o.status === "PENDING"
            ).length;

            setStats({
                totalSales,
                totalOrders: ordersRes.data.length,
                totalProducts: productsRes.data.length,
                pendingOrders,
            });
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    /* ================= PRODUCT HANDLERS ================= */

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", productForm.name);
        formData.append("price", productForm.price);
        formData.append("quantity", productForm.quantity);
        formData.append("harvestDate", productForm.harvestDate);
        if (productForm.image) {
            formData.append("image", productForm.image);
        }

        try {
            if (editingProduct) {
                await api.put(`/consumer/product/${editingProduct._id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Product updated successfully!");
            } else {
                await api.post("/consumer/product", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Product added successfully!");
            }
            closeProductModal();
            fetchData();
        } catch (err) {
            console.error("Error saving product:", err);
            toast.error("Failed to save product.");
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/consumer/product/${id}`);
            setProducts(products.filter((p) => p._id !== id));
            setStats((prev) => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
            toast.success("Product deleted successfully");
        } catch (err) {
            console.error("Error deleting product:", err);
            toast.error("Failed to delete product.");
        }
    };

    const openProductModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setProductForm({
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                harvestDate: product.harvestDate ? product.harvestDate.split("T")[0] : "",
                image: null,
            });
        } else {
            setEditingProduct(null);
            setProductForm({
                name: "",
                price: "",
                quantity: "",
                harvestDate: "",
                image: null,
            });
        }
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        setEditingProduct(null);
    };

    /* ================= ORDER HANDLERS ================= */

    const handleOrderStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.put(`/consumer/order/${orderId}/status`, { status: newStatus });
            setOrders(
                orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
            );
            toast.success("Order status updated");
            // Re-calculate stats lightly if needed, or just let it update on refresh
        } catch (err) {
            console.error("Error updating order status:", err);
            toast.error("Failed to update status.");
        }
    };

    const handleClearHistory = async (status = null) => {
        const message = status
            ? `Are you sure you want to clear ALL ${status} orders?`
            : "Are you sure you want to clear ALL completed orders?";

        if (!window.confirm(message)) return;

        try {
            const url = status
                ? `/consumer/orders/history?status=${status}`
                : "/consumer/orders/history";

            await api.delete(url);
            fetchData();
            setShowClearOptions(false);
            toast.success("Order history updated!");
        } catch (err) {
            console.error("Error clearing history", err);
            toast.error("Failed to clear history.");
        }
    };

    const handleHideOrder = async (orderId) => {
        if (!window.confirm("Hide this order from your history?")) return;
        try {
            await api.put(`/consumer/order/${orderId}/hide`);
            fetchData();
            toast.success("Order hidden");
        } catch (err) {
            console.error("Error hiding order", err);
            toast.error("Failed to hide order.");
        }
    };

    const handleClearFeedback = async (feedbackId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await api.delete(`/feedback/${feedbackId}`);
            setFeedbacks(feedbacks.filter(f => f._id !== feedbackId));
            toast.success("Message deleted");
        } catch (error) {
            console.error("Error deleting feedback:", error);
            toast.error("Failed to delete message.");
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put("/consumer/profile", profile);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        }
    };

    /* ================= RENDERERS ================= */

    if (loading)
        return (
            <DashboardLayout role="CONSUMER">
                <div className="flex items-center justify-center h-[80vh]">
                    <Loader2 className="animate-spin text-green-600" size={48} />
                </div>
            </DashboardLayout>
        );

    return (
        <DashboardLayout role="CONSUMER">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeTab === "overview" && "Dashboard Overview"}
                            {activeTab === "products" && "My Products"}
                            {activeTab === "orders" && "Manage Orders"}
                            {activeTab === "profile" && "My Profile"}
                            {activeTab === "inbox" && "Inbox & Feedback"}
                        </h1>
                        <p className="text-gray-500">
                            Welcome back! Here's what's happening with your farm.
                        </p>
                    </div>
                    {activeTab === "products" && (
                        <button
                            onClick={() => openProductModal()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors shadow-sm"
                        >
                            <Plus size={20} />
                            Add Product
                        </button>
                    )}
                </div>

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <DashboardCard
                                title="Total Sales"
                                value={`₹${stats.totalSales}`}
                                icon={DollarSign}
                                color="bg-green-50"
                            />
                            <DashboardCard
                                title="Total Orders"
                                value={stats.totalOrders}
                                icon={Package}
                                color="bg-blue-50"
                            />
                            <DashboardCard
                                title="Pending Orders"
                                value={stats.pendingOrders}
                                icon={Clock}
                                color="bg-orange-50"
                            />
                            <DashboardCard
                                title="Total Products"
                                value={stats.totalProducts}
                                icon={ShoppingBag}
                                color="bg-purple-50"
                            />
                        </div>

                        {/* Recent Orders Preview */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-bold text-lg">Recent Orders</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                                        <tr>
                                            <th className="px-6 py-4">Product</th>
                                            <th className="px-6 py-4 hidden md:table-cell">Customer</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.slice(0, 5).map((order) => (
                                            <tr key={order._id}>
                                                <td className="px-6 py-4 font-medium">{order.productId?.name || "Unknown Product"}</td>
                                                <td className="px-6 py-4 hidden md:table-cell">{order.userId?.name || "Guest"}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                            order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                                order.status === 'CANCEL' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">₹{order.totalPrice}</td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-8 text-center text-gray-400">No orders yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {activeTab === "products" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <div className="h-48 bg-gray-100 relative">
                                        {product.image ? (
                                            <img
                                                src={product.image.startsWith("http") ? product.image : `https://farm-connect-sand.vercel.app/${product.image.replace(/\\/g, '/')}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=No+Image"; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <ShoppingBag size={48} opacity={0.5} />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                onClick={() => openProductModal(product)}
                                                className="p-2 bg-white/90 rounded-full hover:bg-white text-blue-600 shadow-sm"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product._id)}
                                                className="p-2 bg-white/90 rounded-full hover:bg-white text-red-600 shadow-sm"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-800">
                                            {product.name}
                                        </h3>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-green-700 font-bold text-xl">
                                                ₹{product.price}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                Qty: {product.quantity}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                            <Clock size={12} /> Harvest: {new Date(product.harvestDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                                <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No products added yet. Start by adding your first product!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === "orders" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center relative">
                            <h2 className="font-bold text-lg">Order Management</h2>
                            {orders.length > 0 && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowClearOptions(!showClearOptions)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-red-100"
                                    >
                                        Clear History ▼
                                    </button>
                                    {showClearOptions && (
                                        <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl border border-gray-100 py-2 w-48 z-10 animate-in fade-in zoom-in-95 duration-200">
                                            <button onClick={() => handleClearHistory("DELIVERED")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Clear Delivered</button>
                                            <button onClick={() => handleClearHistory("CANCEL")} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700">Clear Cancelled</button>
                                            <div className="h-px bg-gray-100 my-1"></div>
                                            <button onClick={() => handleClearHistory()} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 font-medium">Clear All Completed</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="divide-y divide-gray-100">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col lg:flex-row justify-between gap-6">

                                            {/* Product Info */}
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                                    {order.productId?.image ? (
                                                        <img src={order.productId.image.startsWith("http") ? order.productId.image : `https://farm-connect-sand.vercel.app/${order.productId.image}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-full h-full p-4 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800">{order.productId?.name || "Product Deleted"}</h3>
                                                    <p className="text-sm text-green-600 font-bold">Total: ₹{order.totalPrice}</p>
                                                    <div className="text-xs text-gray-500 mt-1">Qty: {order.quantity}</div>
                                                </div>
                                            </div>

                                            {/* Customer Info */}
                                            <div className="flex-1 space-y-2 text-sm border-l lg:border-l-0 lg:border-r border-gray-100 px-4">
                                                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                                                    <User size={16} className="text-gray-400" />
                                                    {order.userId?.name || "Guest User"}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone size={16} className="text-gray-400" />
                                                    {order.userId?.phone || order.shippingAddress?.phone || "N/A"}
                                                </div>
                                                <div className="flex items-start gap-2 text-gray-600">
                                                    <MapPin size={16} className="text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p>{order.shippingAddress?.address}</p>
                                                        <p>{order.shippingAddress?.city}{order.shippingAddress?.landmark ? `, ${order.shippingAddress.landmark}` : ''}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex flex-col lg:items-end gap-3 w-full lg:w-auto min-w-[200px]">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                                                    className={`px-4 py-2 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2
                            ${order.status === 'DELIVERED' ? 'border-green-200 bg-green-50 text-green-700 focus:ring-green-500' :
                                                            order.status === 'PENDING' ? 'border-orange-200 bg-orange-50 text-orange-700 focus:ring-orange-500' :
                                                                order.status === 'CANCEL' ? 'border-red-200 bg-red-50 text-red-700 focus:ring-red-500' :
                                                                    'border-blue-200 bg-blue-50 text-blue-700 focus:ring-blue-500'}`}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PROCESS">Processing</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCEL">Cancelled</option>
                                                </select>
                                                <div className="text-xs text-gray-400">
                                                    Ordered: {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                                {["DELIVERED", "CANCEL", "CANCELLED"].includes(order.status) && (
                                                    <button
                                                        onClick={() => handleHideOrder(order._id)}
                                                        className="text-xs text-red-400 hover:text-red-600 underline mt-1"
                                                    >
                                                        Hide Order
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-500">
                                    No orders found.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="font-bold text-lg text-gray-800">Profile Details</h2>
                            <p className="text-gray-500 text-sm">Update your personal information and address.</p>
                        </div>
                        <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.name || ""}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</div>
                                        <input
                                            type="email"
                                            value={profile.email || ""}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            value={profile.phone || ""}
                                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={profile.city || ""}
                                            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            placeholder="City"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                                    <textarea
                                        value={profile.address || ""}
                                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none h-24"
                                        placeholder="Detailed address..."
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium flex items-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                )}


                {activeTab === "inbox" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="font-bold text-lg text-gray-800">Messages & Feedback</h2>
                            <p className="text-gray-500 text-sm">See what users and admins are saying about you.</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {feedbacks.length > 0 ? (
                                feedbacks.map((f) => (
                                    <div key={f._id} className={`p-6 hover:bg-gray-50 transition-colors ${f.role === 'ADMIN' ? 'bg-blue-50/30' : ''}`}>
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
                                                    ${f.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                    {f.role === 'ADMIN' ? 'A' : (f.userId?.name?.charAt(0) || 'U')}
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className={`font-bold text-sm ${f.role === 'ADMIN' ? 'text-blue-700' : 'text-gray-900'}`}>
                                                            {f.role === 'ADMIN' ? 'Administrator' : (f.userId?.name || 'User')}
                                                            {f.role === 'ADMIN' && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Official</span>}
                                                        </h4>
                                                        <p className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleString()}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleClearFeedback(f._id)}
                                                        className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Delete Message"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-700 text-sm leading-relaxed">{f.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                    <MessageSquare size={48} className="mb-4 text-gray-300" />
                                    <p>No messages in your inbox yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* PRODUCT MODAL */}
            {
                isProductModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800">
                                    {editingProduct ? "Edit Product" : "Add New Product"}
                                </h2>
                                <button
                                    onClick={closeProductModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={productForm.name}
                                        onChange={(e) =>
                                            setProductForm({ ...productForm, name: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                        placeholder="e.g. Fresh Tomatoes"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price (₹)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={productForm.price}
                                            onChange={(e) =>
                                                setProductForm({ ...productForm, price: e.target.value })
                                            }
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            value={productForm.quantity}
                                            onChange={(e) =>
                                                setProductForm({ ...productForm, quantity: e.target.value })
                                            }
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            placeholder="Available Stock"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Harvest Date
                                    </label>
                                    <input
                                        type="date"
                                        value={productForm.harvestDate}
                                        onChange={(e) =>
                                            setProductForm({ ...productForm, harvestDate: e.target.value })
                                        }
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setProductForm({ ...productForm, image: e.target.files[0] })
                                        }
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeProductModal}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium"
                                    >
                                        {editingProduct ? "Update Product" : "Save Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </DashboardLayout >
    );
}
