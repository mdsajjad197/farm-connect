import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* ================= GET CART ================= */
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, items: [] });
        }
        // Filter out null products (if product deleted)
        cart.items = cart.items.filter(item => item.productId !== null);
        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, items: [] });
        }

        const startInfo = await Product.findById(productId);
        if (!startInfo) return res.status(404).json({ message: "Product not found" });

        // Check availability
        if (quantity > startInfo.quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            const newQty = cart.items[itemIndex].quantity + quantity;

            if (newQty <= 0) {
                // Remove item if quantity becomes 0 or less
                cart.items.splice(itemIndex, 1);
            } else {
                if (newQty > startInfo.quantity) {
                    return res.status(400).json({ message: "Not enough stock available" });
                }
                cart.items[itemIndex].quantity = newQty;
            }
        } else {
            // New item
            if (quantity > 0) {
                cart.items.push({ productId, quantity });
            }
        }

        await cart.save();

        // Re-fetch to populate
        const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

        // Filter out potential nulls
        if (updatedCart && updatedCart.items) {
            updatedCart.items = updatedCart.items.filter(item => item.productId !== null);
            await updatedCart.save();
        }

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= REMOVE FROM CART ================= */
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        const updatedCart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* ================= CLEAR CART ================= */
export const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
