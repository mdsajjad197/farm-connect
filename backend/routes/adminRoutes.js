import express from "express";
import {
  adminDashboard,
  getAllUsers,
  getAllConsumers,
  getConsumerProducts,
  getConsumerOrders,
  deleteConsumer,
  getUserDetails,
  getUserOrders,
  getAllOrders,
  getOrderDetails,
  deleteProduct,
  deleteAllOrders,
  deleteUser,
  updateOrderStatus
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ================= ADMIN PROTECTED ================= */
router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get("/dashboard", adminDashboard);
router.get("/users", getAllUsers);
router.get("/consumers", getAllConsumers);
router.get("/consumer/:id/products", getConsumerProducts);
router.get("/consumer/:id/orders", getConsumerOrders);
router.delete("/consumer/:id", deleteConsumer);
router.delete("/product/:id", deleteProduct);

router.get("/user/:id", getUserDetails);
router.delete("/user/:id", deleteUser);
router.get("/user/:id/orders", getUserOrders);

router.get("/orders", getAllOrders);
router.delete("/orders", deleteAllOrders);
router.get("/order/:id", getOrderDetails);
router.put("/order/:id/status", updateOrderStatus);

export default router;
