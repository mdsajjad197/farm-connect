import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

/* ================= GET ALL PRODUCTS ================= */

export const getAllProducts = async (req, res) => {
  try {
    let products = await Product.find().populate("consumerId", "name city");
    // Filter out products where consumerId is null (orphaned products)
    products = products.filter(product => product.consumerId !== null);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByConsumerId = async (req, res) => {
  try {
    let products = await Product.find({ consumerId: req.params.id })
      .populate("consumerId", "name city phone email"); // Added phone and email for seller profile

    // Filter out products where consumerId is null (orphaned products)
    products = products.filter(product => product.consumerId !== null);

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET SINGLE PRODUCT ================= */

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "consumerId",
      "name city"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= ADD TO CART (Simple Version) ================= */
/* NOTE: For real apps, cart should be separate model */



/* ================= CREATE ORDER ================= */

/* ================= CHECKOUT / CREATE ORDER ================= */
import Stripe from "stripe";
import Cart from "../models/Cart.js";

const stripe = new Stripe("sk_test_51Msz8ASEWq8T6r40781234567890abcdef"); // DEMO KEY - REPLACE OR ENV

export const checkout = async (req, res) => {
  try {
    const { paymentMethod, paymentDetails, shippingAddress } = req.body;

    // Persist Phone Number and Address to User Profile if missing or updated
    if (shippingAddress && shippingAddress.phone) {
      await User.findByIdAndUpdate(req.user.id, {
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city
      });
    }

    // Get user cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total validation
    let itemsTotal = 0;
    cart.items.forEach(item => {
      itemsTotal += item.productId.price * item.quantity;
    });

    const DELIVERY_CHARGE = 60;
    const finalTotal = itemsTotal + DELIVERY_CHARGE;

    // If Stripe, verify payment logic could go here (e.g. confirming intent)
    // For demo, we assume frontend succeeded if paymentMethod is STRIPE

    const orders = [];

    // Create an order for EACH item
    for (const item of cart.items) {
      const product = item.productId;

      // Decrease stock
      if (item.quantity > product.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
      product.quantity -= item.quantity;
      await product.save();

      const order = await Order.create({
        userId: req.user.id,
        consumerId: product.consumerId,
        productId: product._id,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity, // Individual item price for record
        shippingAddress: shippingAddress, // Add shipping address
        status: "PENDING" // You might want to set to PROCESS if paid
      });
      orders.push(order);
    }

    // Note: The total price in the Order model is per-item/order entry. 
    // If you want to track the GRAND total including delivery, you might need a separate "Transaction" model 
    // or store the delivery charge split across orders, or just on the first one. 
    // For now, we just save the address. The user pays the total + 60.

    // Clear Cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      ordersCount: orders.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPaymentIntent = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId");
    if (!cart) return res.status(400).json({ message: "Cart empty" });

    let total = 0;
    cart.items.forEach(item => total += item.productId.price * item.quantity);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100, // cents
      currency: "inr",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ================= ADD TO CART (DEPRECATED) ================= */
// Removed or commented out as we use cartController now
export const addToCart = async (req, res) => {
  res.status(410).json({ message: "Use /api/user/cart/add endpoint" });
};

// Replaced createOrder above
export const createOrder = async (req, res) => {
  res.status(410).json({ message: "Use /api/user/checkout endpoint" });
};

/* ================= MY ORDERS ================= */

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id, userVisible: true })
      .populate("productId", "name price image")
      .populate("consumerId", "name city phone address")
      .populate("userId", "name email phone city");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearOrderHistory = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {
      userId: req.user.id,
      status: { $in: ["DELIVERED", "CANCEL", "CANCELLED"] }
    };

    // If specific status requested (must be one of the completed statuses)
    if (status && ["DELIVERED", "CANCEL", "CANCELLED"].includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    await Order.updateMany(query, { userVisible: false });
    res.json({ message: "Order history cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const hideOrder = async (req, res) => {
  try {
    await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { userVisible: false }
    );
    res.json({ message: "Order hidden" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= UPDATE USER PROFILE (OPTIONAL) ================= */

export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

