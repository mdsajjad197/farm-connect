
import { useEffect, useState } from "react";
import { ShoppingCart, Eye, Search, Filter } from "lucide-react";
import api from "../api/axios";
import DashboardLayout from "../component/DashboardLayout";
import { Link } from "react-router-dom";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/admin/orders");
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.productId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order._id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PROCESS': return 'bg-blue-100 text-blue-800';
            case 'CANCEL': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const clearHistory = async () => {
        const statusText = statusFilter === "ALL" ? "ALL" : statusFilter;
        if (window.confirm(`Are you sure you want to delete ${statusText} order history? This action cannot be undone.`)) {
            try {
                await api.delete(`/admin/orders?status=${statusFilter}`);
                fetchOrders(); // Refresh list
                alert("Order history Cleared Successfully");
            } catch (error) {
                console.error("Error clearing history", error);
                alert("Failed to clear order history");
            }
        }
    };



    return (
        <DashboardLayout role="ADMIN">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                        <p className="text-gray-500 mt-1">View and manage all platform orders.</p>
                    </div>
                    <button
                        onClick={clearHistory}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <ShoppingCart size={20} />
                        Clear Order History
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Order ID, Product, User..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter size={18} className="text-gray-500" />
                                <select
                                    className="w-full sm:w-auto border border-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="ALL">All Status</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESS">Processing</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCEL">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <span className="text-sm text-gray-500 text-right">Total Orders: {orders.length}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left bg-white">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4 font-semibold hidden lg:table-cell">Order ID</th>
                                    <th className="px-6 py-4 font-semibold">Product</th>
                                    <th className="px-6 py-4 font-semibold hidden md:table-cell">Buyer</th>
                                    <th className="px-6 py-4 font-semibold">Amount</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold hidden xl:table-cell">Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">Loading orders...</td>
                                    </tr>
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="px-6 py-4 text-xs font-mono text-gray-500 hidden lg:table-cell">
                                                {order._id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{order.productId?.name}</div>
                                                <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                                                {order.userId?.name}
                                                <div className="text-xs text-gray-400">{order.userId?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-green-700">
                                                ₹{order.totalPrice}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 hidden xl:table-cell">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/admin/order/${order._id}`}
                                                    className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
