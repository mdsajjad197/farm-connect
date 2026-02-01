
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, Mail, Phone, MapPin, Calendar, ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import api from "../api/axios";
import DashboardLayout from "../component/DashboardLayout";

export default function AdminUserDetails() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, ordersRes] = await Promise.all([
                    api.get(`/admin/user/${id}`),
                    api.get(`/admin/user/${id}/orders`)
                ]);
                setUser(userRes.data);
                setOrders(ordersRes.data);
            } catch (error) {
                console.error("Error fetching details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-green-600" size={48} />
        </div>
    );

    if (!user) return <div className="p-8 text-center">User not found</div>;

    return (
        <DashboardLayout role="ADMIN">
            <div className="max-w-5xl mx-auto space-y-6">
                <Link to="/admin/users" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Users
                </Link>

                {/* User Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-3xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <div className="mt-2 space-y-2 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} /> {user.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} /> {user.phone || "N/A"}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} /> {user.address ? `${user.address}, ${user.city}` : "N/A"}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                                        <Calendar size={14} /> Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <ShoppingCart size={20} /> Order History ({orders.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                            {order._id.substring(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4">{order.productId?.name}</td>
                                        <td className="px-6 py-4 font-medium">₹{order.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold 
                                                ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/admin/order/${order._id}`} className="text-blue-600 hover:underline text-sm">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-400 italic">
                                            No orders placed yet.
                                        </td>
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
