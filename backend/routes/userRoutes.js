import express from "express";
import {
  getAllProducts,
  getProductsByConsumerId,
  getProductById,
  checkout,
  createPaymentIntent,
  myOrders,
  updateProfile,
  getProfile,
  clearOrderHistory,
  hideOrder
} from "../controllers/userController.js";

import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js";

import authMiddleware from "../middleware/authMiddleware.js";

import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/products", getAllProducts);
router.get("/products/consumer/:id", getProductsByConsumerId);
router.get("/products/:id", getProductById);

/* ================= AUTHENTICATED (ANY ROLE) ================= */
router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/my-orders", myOrders);
router.delete("/orders/history", clearOrderHistory);
router.put("/order/:id/hide", hideOrder);

/* ================= USER (SHOPPER) ONLY ================= */
router.use(roleMiddleware("USER"));

router.post("/cart/add", addToCart);
router.get("/cart", getCart);
router.delete("/cart/:productId", removeFromCart);
router.delete("/cart", clearCart);

router.post("/checkout", checkout);
router.post("/create-payment-intent", createPaymentIntent);
// router.post("/order/create", createOrder); // Replaced by checkout


export default router;
