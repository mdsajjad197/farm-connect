import Feedback from "../models/Feedback.js";

// Add feedback (User or Admin)
export const addFeedback = async (req, res) => {
    try {
        const { consumerId, comment } = req.body;
        const role = req.user.role; // Assumes authMiddleware populates req.user

        if (!consumerId || !comment) {
            return res.status(400).json({ message: "Consumer ID and comment are required" });
        }

        const feedbackData = {
            consumerId,
            comment,
            role
        };

        if (role === "USER") {
            feedbackData.userId = req.user.id;
        } else if (role === "ADMIN") {
            feedbackData.adminId = req.user.id;
        } else {
            // Just in case, though middleware should catch this, specific handling if needed
            return res.status(403).json({ message: "Unauthorized role for feedback" });
        }

        const feedback = await Feedback.create(feedbackData);
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Error adding feedback", error: error.message });
    }
};

// Get feedback for a consumer
export const getFeedbackByConsumer = async (req, res) => {
    try {
        const { consumerId } = req.params;
        const feedback = await Feedback.find({ consumerId })
            .populate("userId", "name") // Populate user name if available
            .populate("adminId", "name") // Populate admin name if available (assuming Admin model has name)
            .sort({ createdAt: -1 });

        res.status(200).json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedback", error: error.message });
    }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting feedback", error: error.message });
    }
};
