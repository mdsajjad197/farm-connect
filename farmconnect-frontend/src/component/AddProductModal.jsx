
import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import api from "../api/axios";

export default function AddProductModal({ isOpen, onClose, onSuccess, productToEdit }) {
    const [form, setForm] = useState({
        name: "",
        price: "",
        quantity: "",
        harvestDate: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);

    // Load product data when modal opens or productToEdit changes
    useEffect(() => {
        if (productToEdit) {
            setForm({
                name: productToEdit.name,
                price: productToEdit.price,
                quantity: productToEdit.quantity,
                harvestDate: productToEdit.harvestDate ? productToEdit.harvestDate.split('T')[0] : "",
                image: null // Keep null so we only update if new file selected
            });
        } else {
            setForm({ name: "", price: "", quantity: "", harvestDate: "", image: null });
        }
    }, [productToEdit, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        setForm({ ...form, image: e.target.files[0] });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.price || !form.quantity || !form.harvestDate) return alert("Please fill all fields");

        setLoading(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== null) fd.append(k, v);
        });

        try {
            if (productToEdit) {
                await api.put(`/consumer/product/${productToEdit._id}`, fd);
            } else {
                await api.post("/consumer/product", fd);
            }
            onSuccess();
            onClose();
        } catch {
            alert(productToEdit ? "Update failed" : "Upload failed");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg transition-transform"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">{productToEdit ? "Edit Product" : "Add New Product"}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Fresh Tomatoes"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                name="quantity"
                                type="number"
                                value={form.quantity}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                        <input
                            name="harvestDate"
                            type="date"
                            value={form.harvestDate}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors cursor-pointer relative">
                            <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <Upload className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">{form.image ? form.image.name : (productToEdit ? "Click to change image (optional)" : "Click to upload image")}</p>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button onClick={onClose} className="flex-1 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50"
                        >
                            {loading ? (productToEdit ? "Updating..." : "Adding...") : (productToEdit ? "Update Product" : "Add Product")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
