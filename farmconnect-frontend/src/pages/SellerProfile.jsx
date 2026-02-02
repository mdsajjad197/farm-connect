
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, Mail, Package, ArrowLeft, MessageSquare } from "lucide-react";
import api from "../api/axios";

export default function SellerProfile() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState("");

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const [productsRes, feedbacksRes] = await Promise.all([
                    api.get(`/user/products/consumer/${id}`),
                    api.get(`/feedback/consumer/${id}`)
                ]);

                setProducts(productsRes.data);
                if (productsRes.data.length > 0) {
                    setSeller(productsRes.data[0].consumerId);
                }
                setFeedbacks(feedbacksRes.data);
            } catch (err) {
                console.error("Failed to load seller data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSellerData();
    }, [id]);

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/feedback/add", {
                consumerId: id,
                comment: newFeedback
            });
            setFeedbacks([res.data, ...feedbacks]);
            setNewFeedback("");
            alert("Feedback submitted!");
        } catch (err) {
            console.error("Error submitting feedback", err);
            alert("Failed to submit feedback. Please make sure you are logged in.");
        }
    };

    const addToCart = async (productId) => {
        try {
            await api.post("/user/cart/add", {
                productId,
                quantity: 1
            });
            alert("Added to cart");
        } catch {
            alert("Please login to add to cart");
        }
    };


    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading seller profile...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 pt-8">
            <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-green-600 mb-6">
                <ArrowLeft size={20} className="mr-2" /> Back to Products
            </Link>

            {/* Seller Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-3xl font-bold">
                        {seller?.name?.charAt(0) || "S"}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-gray-900">{seller?.name || "Seller"}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} /> {seller?.city || "Unknown City"}
                            </div>
                            {seller?.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={18} /> {seller.phone}
                                </div>
                            )}
                            {seller?.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={18} /> {seller.email}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Products</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Package className="text-green-600" /> Products from {seller?.name}
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                    <div key={p._id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col h-full">
                        <Link to={`/product/${p._id}`}>
                            <img
                                src={p.image?.startsWith("http") ? p.image : `https://farm-connect-sand.vercel.app/${p.image}`}
                                alt={p.name}
                                className="h-40 w-full object-cover rounded-lg mb-3"
                            />
                        </Link>
                        <h3 className="font-semibold text-lg">{p.name}</h3>
                        <p className="text-green-600 font-bold">₹{p.price}/per-kg</p>
                        <p className="text-sm text-gray-500 mb-4">Qty: {p.quantity}</p>

                        <button
                            onClick={() => addToCart(p._id)}
                            disabled={p.quantity <= 0}
                            className={`mt-auto w-full py-2 rounded text-white transition ${p.quantity > 0
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {p.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                        </button>
                    </div>
                ))}
                {products.length === 0 && (
                    <p className="text-gray-500 col-span-full text-center py-10">This seller has no other products listed.</p>
                )}
            </div>

            {/* Feedback Section */}
            <div className="mt-12 mb-8 border-t border-gray-100 pt-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MessageSquare className="text-green-600" /> Feedback & Reviews
                </h2>

                {/* Add Feedback Form */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
                    <h3 className="font-semibold text-gray-800 mb-3">Leave a comment</h3>
                    <form onSubmit={submitFeedback}>
                        <textarea
                            className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                            rows="3"
                            placeholder="Share your experience with this seller..."
                            value={newFeedback}
                            onChange={(e) => setNewFeedback(e.target.value)}
                            required
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                        >
                            Post Comment
                        </button>
                    </form>
                </div>

                {/* Feedback List */}
                <div className="space-y-4">
                    {feedbacks.length > 0 ? (
                        feedbacks.map((f) => (
                            <div key={f._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                            {f.role === 'ADMIN' ? 'A' : (f.userId?.name?.charAt(0) || 'U')}
                                        </div>
                                        <div>
                                            <span className={`font-bold text-sm ${f.role === 'ADMIN' ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {f.role === 'ADMIN' ? 'Administrator' : (f.userId?.name || 'User')}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-2">
                                                {new Date(f.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700">{f.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No feedback yet. Be the first to review!</p>
                    )}
                </div>
            </div>
        </div>
    );
}
