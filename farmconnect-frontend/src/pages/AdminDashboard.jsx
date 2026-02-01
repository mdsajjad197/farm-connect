
import { useEffect, useState } from "react";
import { Users, Shield, Trash2, Mail, Loader2, List, ShoppingCart, Eye, Search, Filter } from "lucide-react";
import api from "../api/axios";
import DashboardLayout from "../component/DashboardLayout";
import DashboardCard from "../component/DashboardCard";

export default function AdminDashboard() {
    const [consumers, setConsumers] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, totalConsumers: 0 });
    const [loading, setLoading] = useState(true);
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [details, setDetails] = useState({ products: [], orders: [], type: '' });
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("ALL");

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [statsRes, consumersRes] = await Promise.all([
                api.get("/admin/dashboard"),
                api.get("/admin/consumers")
            ]);
            setStats(statsRes.data);
            setConsumers(consumersRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchConsumerDetails = async (consumer) => {
        setDetailsLoading(true);
        setSelectedConsumer(consumer);
        setDetails({ products: [], orders: [], type: 'details' });
        try {
            const [productsRes, ordersRes] = await Promise.all([
                api.get(`/admin/consumer/${consumer._id}/products`),
                api.get(`/admin/consumer/${consumer._id}/orders`)
            ]);
            setDetails({ products: productsRes.data, orders: ordersRes.data, type: 'details' });
        } catch (error) {
            console.error("Error fetching details", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const deleteConsumer = async (id) => {
        if (!window.confirm("Are you sure you want to delete this consumer and all their products?")) return;
        try {
            await api.delete(`/admin/consumer/${id}`);
            setConsumers(consumers.filter(c => c._id !== id));
            setStats(prev => ({ ...prev, totalConsumers: prev.totalConsumers - 1 }));
            alert("Consumer deleted successfully");
        } catch (error) {
            console.error("Delete failed", error);
            alert(error.response?.data?.message || error.response?.data?.error || "Failed to delete consumer");
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <Loader2 className="animate-spin text-green-600" size={48} />
        </div>
    );

    const uniqueCities = [...new Set(consumers.map(c => c.city))];

    const filteredConsumers = consumers.filter(consumer => {
        const matchesSearch =
            consumer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            consumer.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = cityFilter === "ALL" || consumer.city === cityFilter;

        return matchesSearch && matchesCity;
    });

    return (
        <DashboardLayout role="ADMIN">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">System-wide overview and consumer management.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DashboardCard title="Total Users" value={stats.totalUsers} icon={Users} color="bg-blue-50/50" />
                    <DashboardCard title="Total Consumers" value={stats.totalConsumers} icon={Shield} color="bg-teal-50/50" />
                    <DashboardCard title="Active Cities" value={new Set(consumers.map(c => c.city)).size} icon={Shield} color="bg-indigo-50/50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Consumers Table */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
                            <h2 className="text-xl font-bold text-gray-800">Consumer Management</h2>

                            {/* Search and Filter */}
                            {/* Search and Filter */}
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                <div className="relative flex-1">
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
                                        className="w-full sm:w-auto border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm bg-gray-50"
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
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left bg-white">
                                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 font-semibold">Name</th>
                                        <th className="px-4 md:px-6 py-4 font-semibold hidden sm:table-cell">City</th>
                                        <th className="px-4 md:px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredConsumers.map((consumer, i) => (
                                        <tr key={consumer._id || i} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-4 md:px-6 py-4">
                                                <div className="font-medium text-gray-900 break-words max-w-[150px] sm:max-w-none">{consumer.name}</div>
                                                <div className="text-xs text-gray-500 break-all">{consumer.email}</div>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {consumer.city}
                                                </span>
                                            </td>
                                            <td className="px-4 md:px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => fetchConsumerDetails(consumer)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteConsumer(consumer._id)}
                                                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50"
                                                        title="Delete Consumer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick View Side Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Consumer Details</h2>
                        {selectedConsumer ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm font-bold text-gray-900">{selectedConsumer.name}</p>
                                    <p className="text-xs text-gray-500">{selectedConsumer.phone}</p>
                                    <p className="text-xs text-gray-500 mt-1">{selectedConsumer.address}</p>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <List size={16} /> Listings ({details.products.length})
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 mb-4">
                                        {detailsLoading ? (
                                            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-green-600" size={24} /></div>
                                        ) : details.products.length > 0 ? (
                                            details.products.map(p => (
                                                <div key={p._id} className="text-sm flex justify-between p-2 hover:bg-gray-50 rounded border border-gray-50">
                                                    <span>{p.name}</span>
                                                    <span className="font-bold text-green-700">₹{p.price}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">No products listed.</p>
                                        )}
                                    </div>

                                    <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 border-t pt-4">
                                        <ShoppingCart size={16} /> Recent Orders ({details.orders.length})
                                    </h3>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                        {detailsLoading ? (
                                            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-green-600" size={24} /></div>
                                        ) : details.orders.length > 0 ? (
                                            details.orders.map(o => (
                                                <div key={o._id} className="text-xs p-2 hover:bg-gray-50 rounded border border-gray-50">
                                                    <div className="flex justify-between font-bold">
                                                        <span>{o.productId?.name}</span>
                                                        <span>₹{o.totalPrice}</span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-500 mt-1">
                                                        <span>Qty: {o.quantity}</span>
                                                        <span>{o.status}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-400 italic">No orders found.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-400">
                                <Eye size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Select a consumer to view details</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
