import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    consumerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumer",
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "PROCESS", "DELIVERED", "CANCEL"],
      default: "PENDING"
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      landmark: { type: String },
      phone: { type: String, required: true }
    },
    userVisible: { type: Boolean, default: true },
    consumerVisible: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
