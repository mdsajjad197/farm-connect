import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Plus, ShoppingBag } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if wrapped in Link
    addToCart(product._id);
  };

  const imageUrl = product.image?.startsWith("http")
    ? product.image
    : `https://farm-connect-sand.vercel.app${product.image?.startsWith('/') ? '' : '/'}${product.image}`;

  return (
    <Link to={`/product/${product._id}`} className="group block h-full">
      <div className="relative h-full bg-white/40 backdrop-blur-md border border-white/50 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 overflow-hidden group-hover:-translate-y-2 flex flex-col hover:drop-shadow-lg">

        {/* Image Container with Overlay */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-green-900/0 group-hover:bg-green-900/10 transition-colors z-10 duration-500"></div>
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          {product.quantity <= 0 && (
            <div className="absolute inset-0 bg-gray-900/60 z-20 flex items-center justify-center backdrop-blur-sm">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-800 text-lg truncate pr-2 group-hover:text-green-700 transition-colors">{product.name}</h3>
            <span className="font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg text-sm whitespace-nowrap">₹{product.price}</span>
          </div>

          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>

          <button
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group/btn ${product.quantity > 0
              ? "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {product.quantity > 0 ? (
              <>
                <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
                Add to Cart
              </>
            ) : "Out of Stock"}
          </button>
        </div>
      </div>
    </Link>
  );
}
