import Consumer from "../models/Consumer.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/* ================= PROFILE HANDLERS ================= */

export const getConsumerProfile = async (req, res) => {
  try {
    const consumer = await Consumer.findById(req.user.id).select("-password");
    if (!consumer) return res.status(404).json({ message: "Consumer not found" });
    res.json(consumer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateConsumerProfile = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;
    const consumer = await Consumer.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, city },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", consumer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= ADD PRODUCT ================= */

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      consumerId: req.user.id,
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      harvestDate: req.body.harvestDate,
      image: req.file ? req.file.path : null
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearOrderHistory = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {
      consumerId: req.user.id,
      status: { $in: ["DELIVERED", "CANCEL", "CANCELLED"] }
    };

    if (status && ["DELIVERED", "CANCEL", "CANCELLED"].includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    await Order.updateMany(query, { consumerVisible: false });
    res.json({ message: "Order history cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const hideOrder = async (req, res) => {
  try {
    await Order.findOneAndUpdate(
      { _id: req.params.id, consumerId: req.user.id },
      { consumerVisible: false }
    );
    res.json({ message: "Order hidden" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CONSUMER PRODUCTS ================= */

export const getConsumerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      consumerId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= CONSUMER ORDERS ================= */

export const getConsumerOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      consumerId: req.user.id,
      consumerVisible: true
    })
      .populate("productId", "name image price")
      .populate("userId", "name city phone")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ORDER STATUS ================= */

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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE PRODUCT ================= */

export const updateProduct = async (req, res) => {
  try {
    const { name, price, quantity, harvestDate } = req.body;
    let updateData = { name, price, quantity, harvestDate };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, consumerId: req.user.id },
      updateData,
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE PRODUCT ================= */

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      consumerId: req.user.id
    });

    if (!product) return res.status(404).json({ message: "Product not found or unauthorized" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
