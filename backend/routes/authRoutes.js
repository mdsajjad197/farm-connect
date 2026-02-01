import express from "express";
import {
  userSignup,
  userLogin,
  consumerSignup,
  consumerLogin,
  adminLogin
} from "../controllers/authController.js";

const router = express.Router();

// Public routes - no authentication required
router.post("/user/signup", userSignup);
router.post("/user/login", userLogin);
router.post("/consumer/signup", consumerSignup);
router.post("/consumer/login", consumerLogin);
router.post("/admin/login", adminLogin);

export default router;
