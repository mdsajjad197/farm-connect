import User from "../models/User.js";
import Consumer from "../models/Consumer.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/* ================= DASHBOARD ================= */

export const adminDashboard = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const consumers = await Consumer.countDocuments();

    res.json({
      totalUsers: users,
      totalConsumers: consumers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LIST ================= */

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

export const getAllConsumers = async (req, res) => {
  const consumers = await Consumer.find().select("-password");
  res.json(consumers);
};

/* ================= CONSUMER PRODUCTS ================= */

export const getConsumerProducts = async (req, res) => {
  const products = await Product.find({ consumerId: req.params.id });
  res.json(products);
};

export const getConsumerOrders = async (req, res) => {
  const orders = await Order.find({ consumerId: req.params.id })
    .populate("productId", "name price")
    .populate("userId", "name city");
  res.json(orders);
};


/* ================= DELETE CONSUMER ================= */

export const deleteConsumer = async (req, res) => {
  console.log("Attempting to delete consumer:", req.params.id); // Debug Log
  try {
    const consumer = await Consumer.findByIdAndDelete(req.params.id);
    if (!consumer) {
      console.log("Consumer not found in DB");
    } else {
      console.log("Consumer deleted from DB:", consumer._id);
    }

    await Product.deleteMany({ consumerId: req.params.id });
    console.log("Associated products deleted");

    res.json({ message: "Consumer removed successfully" });
  } catch (error) {
    console.error("Delete Consumer Error:", error); // Debug Log
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= USER MANAGEMENT ================= */

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
      .populate("productId", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= ORDER MANAGEMENT ================= */

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("productId", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "ALL" ? { status } : {};

    const result = await Order.deleteMany(filter);

    res.json({
      message: "Orders deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email city address phone")
      .populate("productId", "name price description category") // Add more fields as needed
      .populate({
        path: "productId",
        populate: { path: "consumerId", select: "name" } // Show who sold it
      });

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
