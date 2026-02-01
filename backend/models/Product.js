import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  consumerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Consumer",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: String,
  harvestDate: Date,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
