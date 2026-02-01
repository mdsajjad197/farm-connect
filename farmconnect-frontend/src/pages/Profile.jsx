import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Package, ShoppingBag, Edit2, LogOut, MapPin, Phone, Mail, User, Save, X, Calendar, Truck, Eye } from "lucide-react";
import api from "../api/axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'orders'
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [selectedOrderForShipping, setSelectedOrderForShipping] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileRes = await api.get("/user/profile");
      setUser(profileRes.data);
      setFormData(profileRes.data);

      const ordersRes = await api.get("/user/my-orders");
      // Sort by date descending
      const sortedOrders = ordersRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await api.put("/user/profile", formData);
      setUser(res.data.user);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="animate-spin text-green-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-red-50 p-6 rounded-2xl max-w-md w-full border border-red-100">
        <p className="text-xl font-bold text-red-600 mb-2">Error Loading Profile</p>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-white border border-red-200 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!user) return <p className="text-center mt-10">Failed to load profile</p>;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">

      {/* HEADER & COVER */}
      <div className="relative h-64 bg-gradient-to-r from-green-600 to-emerald-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR NAVIGATION */}
          <div className="lg:w-1/4 flex flex-col gap-6">
            {/* USER INFO CARD */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-center p-6">
              <div className="w-32 h-32 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-600 border-4 border-white shadow-lg -mt-16 mb-4">
                <span className="text-4xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-6">{user.email}</p>

              <nav className="flex flex-col gap-2 text-left">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User size={20} /> My Profile
                </button>
                <button
                  onClick={() => navigate('/order/my-orders')}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'orders' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <ShoppingBag size={20} /> My Orders
                  <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{orders.length}</span>
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-colors font-semibold"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1">
            {activeTab === 'profile' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <User size={24} className="text-green-600" /> Personal Information
                  </h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-green-600 hover:text-green-700 font-semibold text-sm flex items-center gap-1 hover:underline bg-green-50 px-3 py-1.5 rounded-lg"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
                    {isEditing ? (
                      <input type="text" name="name" value={formData.name || ""} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white" />
                    ) : (
                      <p className="text-gray-900 font-semibold text-lg">{user.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
                    <p className="text-gray-700 font-medium text-lg flex items-center gap-2"><Mail size={16} className="text-gray-400" /> {user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Phone Number</label>
                    {isEditing ? (
                      <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white" placeholder="+91 98765 43210" />
                    ) : (
                      <p className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" /> {user.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Location</label>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <input type="text" name="city" value={formData.city || ""} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white" placeholder="City" />
                          <input type="text" name="address" value={formData.address || ""} onChange={handleChange} className="w-1/2 border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white" placeholder="Address" />
                        </>
                      ) : (
                        <p className="text-gray-900 font-medium text-lg flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" /> {user.city ? `${user.city}, ${user.address || ''}` : "Address not set"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 flex gap-3 justify-end border-t border-gray-100 pt-6">
                    <button onClick={() => { setIsEditing(false); setFormData(user); }} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-colors flex items-center gap-2">
                      <X size={18} /> Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 font-semibold transition-all hover:-translate-y-0.5 flex items-center gap-2">
                      <Save size={18} /> Save Changes
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-end mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    Order History
                  </h2>
                </div>


                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="text-green-600" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders placed</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Start exploring fresh produce from local farmers and support your community.</p>
                    <button onClick={() => navigate("/products")} className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg">
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        {/* Order Top Bar */}
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
                          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border tracking-wide ${getStatusColor(order.status)}`}>
                            {order.status}
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            {/* Image */}
                            <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-200">
                              <Package className="text-gray-300" size={32} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{order.productId?.name || "Product Unavailable"}</h3>
                              <p className="text-gray-500 text-sm line-clamp-1 mb-3 text-left">{order.productId?.description || "No description available"}</p>

                              <div className="flex flex-wrap gap-3 text-sm mb-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 font-medium">
                                  Qty: {order.quantity}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-green-50 text-green-700 font-medium">
                                  Total: ₹{order.totalPrice}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                                  Seller: {order.consumerId?.name || "Unknown"}
                                </span>
                              </div>

                              {/* Seller Details Inline */}
                              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-sm animate-fade-in-up">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Seller Details</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4">
                                  <p className="text-gray-700"><span className="font-semibold">Name:</span> {order.consumerId?.name || "Unknown"}</p>
                                  <p className="text-gray-700"><span className="font-semibold">Phone:</span> {order.consumerId?.phone || "Not provided"}</p>
                                  <p className="text-gray-700 md:col-span-2 truncate"><span className="font-semibold">Address:</span> {order.consumerId?.address || "N/A"}, {order.consumerId?.city || ""}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                              <button
                                onClick={() => setSelectedOrderForShipping(order)}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-green-200 text-green-600 bg-green-50 text-sm font-bold rounded-lg hover:bg-green-100 transition-all"
                              >
                                <Eye size={16} /> details
                              </button>
                            </div>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

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
                    <p className="font-semibold text-gray-900 text-base">{selectedOrderForShipping.shippingAddress?.address || user.address || "Address not provided"}</p>
                    <p className="text-gray-600">{selectedOrderForShipping.shippingAddress?.city || user.city}</p>
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
                    <p className="font-semibold text-gray-900">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Phone size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact Number</p>
                    <p className="font-semibold text-gray-900 font-mono tracking-wide">{selectedOrderForShipping.shippingAddress?.phone || user.phone || "Not provided"}</p>
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

      </div>
    </div>
  );
}
