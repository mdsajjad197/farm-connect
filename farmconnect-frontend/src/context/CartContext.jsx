import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.get("/user/cart");
            console.log("Cart Response:", res.data); // DEBUG
            if (res.data && res.data.items) {
                const formattedCart = res.data.items
                    .filter(item => item.productId) // Filter out null products
                    .map(item => ({
                        ...item.productId, // Product Details
                        qty: item.quantity, // Quantity from cart item
                        cartItemId: item.productId._id // ID reference
                    }));
                console.log("Formatted Cart:", formattedCart); // DEBUG
                setCart(formattedCart);
            } else {
                setCart([]);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
            // If 401, maybe just empty cart
            setCart([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            await api.post("/user/cart/add", { productId, quantity });
            fetchCart(); // Refresh cart
            return true;
        } catch (error) {
            console.error("Add to cart failed", error);
            alert(error.response?.data?.message || "Failed to add to cart");
            return false;
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await api.delete(`/user/cart/${productId}`);
            fetchCart();
        } catch (error) {
            console.error("Remove failed", error);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete("/user/cart");
            setCart([]);
        } catch (error) {
            console.error("Clear failed", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, fetchCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};
