import express from "express";
import { addFeedback, getFeedbackByConsumer, deleteFeedback } from "../controllers/feedbackController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add feedback (Protected)
router.post("/add", authMiddleware, addFeedback);

// Get feedback for a consumer (Public)
router.get("/consumer/:consumerId", getFeedbackByConsumer);

// Delete feedback (Protected)
router.delete("/:id", authMiddleware, deleteFeedback);

export default router;
