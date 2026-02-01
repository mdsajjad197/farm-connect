
import { useEffect, useState } from "react";
import { Shield, Trash2, Eye, Search, Filter, MapPin, Loader2, List, ShoppingCart, MessageSquare } from "lucide-react";
import api from "../api/axios";
import DashboardLayout from "../component/DashboardLayout";

export default function AdminConsumers() {
    const [consumers, setConsumers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("ALL");

    // Details Side Panel State
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [details, setDetails] = useState({ products: [], orders: [], feedbacks: [] });
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [newAdminFeedback, setNewAdminFeedback] = useState("");

    useEffect(() => {
        fetchConsumers();
    }, []);

    const fetchConsumers = async () => {
        try {
            const res = await api.get("/admin/consumers");
            setConsumers(res.data);
        } catch (error) {
            console.error("Error fetching consumers", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConsumerDetails = async (consumer) => {
        setDetailsLoading(true);
        setSelectedConsumer(consumer);
        setDetails({ products: [], orders: [], feedbacks: [] });
        try {
            const [productsRes, ordersRes, feedbacksRes] = await Promise.all([
                api.get(`/admin/consumer/${consumer._id}/products`),
                api.get(`/admin/consumer/${consumer._id}/orders`),
                api.get(`/feedback/consumer/${consumer._id}`)
            ]);
            setDetails({ products: productsRes.data, orders: ordersRes.data, feedbacks: feedbacksRes.data });
        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const submitAdminFeedback = async (e) => {
        e.preventDefault();
        if (!selectedConsumer) return;
        try {
            const res = await api.post("/feedback/add", {
                consumerId: selectedConsumer._id,
                comment: newAdminFeedback
            });
            setDetails(prev => ({
                ...prev,
                feedbacks: [res.data, ...prev.feedbacks]
            }));
            setNewAdminFeedback("");
            alert("Feedback added successfully");
        } catch (err) {
            console.error("Error adding feedback", err);
            alert("Failed to add feedback");
        }
    };

    const deleteConsumer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this consumer and all their products?")) return;
        try {
            await api.delete(`/admin/consumer/${id}`);
            setConsumers(consumers.filter(c => c._id !== id));
            if (selectedConsumer?._id === id) {
                setSelectedConsumer(null);
            }
        } catch {
            alert("Failed to delete");
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/admin/product/${id}`);
            // Remove product from details list locally
            setDetails(prev => ({
                ...prev,
                products: prev.products.filter(p => p._id !== id)
            }));
        } catch {
            alert("Failed to delete product");
        }
    };

    // Derived state for filtering
    const uniqueCities = [...new Set(consumers.map(c => c.city))];

    const filteredConsumers = consumers.filter(consumer => {
        const matchesSearch =
            consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = cityFilter === "ALL" || consumer.city === cityFilter;

        return matchesSearch && matchesCity;
    });

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-green-600" size={48} />
        </div>
    );

    return (
        <DashboardLayout role="ADMIN">
            <div className="max-w-7xl mx-auto md:h-[calc(100vh-100px)] h-auto flex flex-col">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Consumer Management</h1>
                        <p className="text-gray-500 mt-1">Manage farmers and sellers on the platform.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-0">
                    {/* Consumers List */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                        {/* Filters */}
                        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search consumers..."
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter size={16} className="text-gray-500" />
                                <select
                                    className="border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gray-50"
                                    value={cityFilter}
                                    onChange={(e) => setCityFilter(e.target.value)}
                                >
                                    <option value="ALL">All Cities</option>
                                    {uniqueCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0 bg-gray-50 z-10">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Name / Email</th>
                                        <th className="px-6 py-3 font-semibold hidden md:table-cell">Location</th>
                                        <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredConsumers.length > 0 ? (
                                        filteredConsumers.map((consumer) => (
                                            <tr
                                                key={consumer._id}
                                                className={`hover:bg-green-50/50 transition-colors cursor-pointer ${selectedConsumer?._id === consumer._id ? 'bg-green-50' : ''}`}
                                                onClick={() => fetchConsumerDetails(consumer)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{consumer.name}</div>
                                                    <div className="text-xs text-gray-500">{consumer.email}</div>
                                                </td>
                                                <td className="px-6 py-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MapPin size={14} className="text-gray-400" />
                                                        {consumer.city}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteConsumer(consumer._id);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                        title="Delete Consumer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-gray-500 italic">No consumers match your search.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-2 border-t border-gray-100 text-xs text-gray-400 text-center">
                            Showing {filteredConsumers.length} of {consumers.length} consumers
                        </div>
                    </div>

                    {/* Quick View Side Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Consumer Details</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {selectedConsumer ? (
                                <div className="space-y-6">
                                    {/* Profile Info */}
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-green-700 text-2xl font-bold mx-auto mb-3 shadow-inner">
                                            {selectedConsumer.name.charAt(0)}
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">{selectedConsumer.name}</h3>
                                        <p className="text-sm text-gray-500 mb-1">{selectedConsumer.phone}</p>
                                        <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                            <MapPin size={14} /> {selectedConsumer.address}, {selectedConsumer.city}
                                        </p>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <List size={16} /> Listings ({details.products.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {detailsLoading ? (
                                                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-green-600" size={24} /></div>
                                            ) : details.products.length > 0 ? (
                                                details.products.map(p => (
                                                    <div key={p._id} className="text-sm flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors">
                                                        <div className="flex-1">
                                                            <div className="font-medium text-gray-800">{p.name}</div>
                                                            <div className="font-bold text-green-700">₹{p.price}</div>
                                                        </div>
                                                        <button
                                                            onClick={() => deleteProduct(p._id)}
                                                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors ml-2"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic text-center py-2">No active listings.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <ShoppingCart size={16} /> Recent Orders ({details.orders.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {detailsLoading ? (
                                                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-green-600" size={24} /></div>
                                            ) : details.orders.length > 0 ? (
                                                details.orders.map(o => (
                                                    <div key={o._id} className="text-xs p-3 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors">
                                                        <div className="flex justify-between font-bold text-gray-800">
                                                            <span>{o.productId?.name}</span>
                                                            <span className="text-green-700">₹{o.totalPrice}</span>
                                                        </div>
                                                        <div className="flex justify-between text-gray-500 mt-1">
                                                            <span>Qty: {o.quantity}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${o.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {o.status}
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 mt-1 text-right">
                                                            {new Date(o.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic text-center py-2">No orders received.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Feedback Section */}
                                    <div className="border-t border-gray-100 pt-4 pb-4">
                                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                            <MessageSquare size={16} /> Feedback ({details.feedbacks?.length || 0})
                                        </h3>

                                        {/* Add Feedback */}
                                        <form onSubmit={submitAdminFeedback} className="mb-4">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-500"
                                                    placeholder="Add admin note..."
                                                    value={newAdminFeedback}
                                                    onChange={(e) => setNewAdminFeedback(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-green-600 text-white text-xs px-3 py-1.5 rounded hover:bg-green-700"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </form>

                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                            {detailsLoading ? (
                                                <div className="flex justify-center py-4"><Loader2 className="animate-spin text-green-600" size={24} /></div>
                                            ) : details.feedbacks?.length > 0 ? (
                                                details.feedbacks.map(f => (
                                                    <div key={f._id} className={`text-xs p-3 rounded-lg border ${f.role === 'ADMIN' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100'}`}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className={`font-bold ${f.role === 'ADMIN' ? 'text-blue-700' : 'text-gray-700'}`}>
                                                                {f.role === 'ADMIN' ? 'Admin' : (f.userId?.name || 'User')}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400">
                                                                {new Date(f.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600">{f.comment}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-400 italic text-center py-2">No feedback yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                    <Eye size={48} className="mb-4 opacity-20" />
                                    <p className="text-center text-sm">Select a consumer from the list to view their full profile, products, and order history.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
