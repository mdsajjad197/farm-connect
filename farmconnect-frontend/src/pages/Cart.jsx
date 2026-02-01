import { ShoppingBag, Trash2, ArrowRight, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, addToCart } = useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // EMPTY CART UI
  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-gray-500 bg-gradient-to-br from-green-50/50 to-white">
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 group-hover:scale-125 transition-transform duration-700"></div>
          <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-green-50">
            <ShoppingBag className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{t('cart.emptyTitle')}</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center text-lg">
          {t('cart.emptyDesc')}
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group"
        >
          {t('cart.browse')} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <span className="bg-green-100 text-green-600 p-2 rounded-lg"><ShoppingBag size={28} /></span>
          {t('cart.title')}
          <span className="text-sm font-medium text-gray-500 self-end mb-1 ml-2">({cart.length} items)</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* CART ITEMS LIST */}
          <div className="flex-1 space-y-4">
            {cart.map((item, index) => (
              <div
                key={item.cartItemId}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-sm border border-white/50 hover:shadow-md transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6 items-center">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag size={32} />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate pr-4">{item.name}</h3>
                        <p className="text-green-600 font-bold text-lg">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                        title="Remove Item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-100/80 rounded-xl p-1.5 shadow-inner">
                        <button
                          onClick={() => addToCart(item.cartItemId, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:text-green-600 transition-colors hover:scale-105 active:scale-95 disabled:opacity-50"
                          disabled={item.qty <= 1}
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">{item.qty}</span>
                        <button
                          onClick={() => addToCart(item.cartItemId, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:text-green-600 transition-colors hover:scale-105 active:scale-95"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>

                      <p className="font-extrabold text-xl text-gray-900">₹{item.price * item.qty}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CHECKOUT SUMMARY */}
          <div className="lg:w-96">
            <div className="sticky top-24 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="font-medium text-gray-900">₹40</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax Estimate</span>
                  <span className="font-medium text-gray-900">₹{Math.round(totalPrice * 0.05)}</span>
                </div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Order Total</span>
                  <span className="text-2xl text-green-600">₹{totalPrice + 40 + Math.round(totalPrice * 0.05)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/payment")}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {t('cart.checkout')} <ArrowRight size={20} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheckIcon /> Secure Checkout
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
