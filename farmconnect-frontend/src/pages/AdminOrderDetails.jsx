
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Package, User, MapPin, Calendar, ArrowLeft, Loader2, CreditCard } from "lucide-react";
import api from "../api/axios";
import DashboardLayout from "../component/DashboardLayout";

export default function AdminOrderDetails() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/admin/order/${id}`);
                setOrder(res.data);
            } catch (error) {
                console.error("Error fetching order", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleUpdateStatus = async (newStatus) => {
        if (!order) return;
        setUpdating(true);
        try {
            const res = await api.put(`/admin/order/${id}/status`, { status: newStatus });
            setOrder(res.data);
            alert("Order status updated successfully");
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-green-600" size={48} />
        </div>
    );

    if (!order) return <div className="p-8 text-center">Order not found</div>;

    return (
        <DashboardLayout role="ADMIN">
            <div className="max-w-4xl mx-auto space-y-6">
                <Link to="/admin/orders" className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Orders
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Package className="text-green-600" /> Order #{order._id}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Placed on {new Date(order.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(e.target.value)}
                                disabled={updating}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="PROCESS">Processing</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCEL">Cancelled</option>
                            </select>
                            <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide
                                 ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'CANCEL' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        {/* Product Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Product Details</h3>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">{order.productId?.name}</h2>
                                <p className="text-sm text-gray-600 mt-1">{order.productId?.description}</p>
                                <div className="mt-4 flex justify-between items-end">
                                    <div className="text-sm">
                                        <span className="block text-gray-400">Sold by</span>
                                        <span className="font-medium text-gray-800">{order.productId?.consumerId?.name || "Unknown Seller"}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs text-gray-400">Unit Price</span>
                                        <span className="font-medium">₹{order.productId?.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Quantity</p>
                                    <p className="font-bold text-lg">{order.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-bold text-2xl text-green-700">₹{order.totalPrice}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Customer Details</h3>
                            <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 p-2 rounded-full text-blue-600">
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{order.userId?.name}</p>
                                        <p className="text-xs text-gray-500">{order.userId?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                                    <div className="bg-orange-50 p-2 rounded-full text-orange-600">
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Shipping Address</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {order.shippingAddress ?
                                                <>
                                                    <span className="block">{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.landmark ? `(${order.shippingAddress.landmark})` : ''}</span>
                                                    <span className="block text-green-600 mt-1">
                                                        📞 {order.shippingAddress.phone || order.userId?.phone || "—"}
                                                    </span>
                                                </>
                                                :
                                                `${order.userId?.address || ''}, ${order.userId?.city || ''}`
                                            }
                                            {/* Always show phone if available, even in fallback */}
                                            {(!order.shippingAddress && order.userId?.phone) && (
                                                <span className="block text-green-600 mt-1">📞 {order.userId.phone}</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info Placeholder */}
                            <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-3 opacity-60">
                                <CreditCard size={18} className="text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Payment Method</p>
                                    <p className="text-sm font-medium">Cash on Delivery</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
