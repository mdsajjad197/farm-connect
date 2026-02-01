import express from "express";
import {
  addProduct,
  getConsumerProducts,
  getConsumerOrders,
  updateOrderStatus,
  deleteProduct,
  updateProduct,
  clearOrderHistory,
  hideOrder,
  getConsumerProfile,
  updateConsumerProfile
} from "../controllers/consumerController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* 🔒 Consumer protected */
router.use(authMiddleware, roleMiddleware("CONSUMER"));

router.get("/products", getConsumerProducts);
router.get("/orders", getConsumerOrders);
router.get("/profile", getConsumerProfile);
router.put("/profile", updateConsumerProfile);

router.post("/product", upload.single("image"), addProduct);
router.put("/product/:id", upload.single("image"), updateProduct);

router.put("/order/:id/status", updateOrderStatus);
router.delete("/product/:id", deleteProduct);
router.delete("/orders/history", clearOrderHistory);
router.put("/order/:id/hide", hideOrder);

export default router;
