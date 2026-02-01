import mongoose from "mongoose";
import Product from "./Product.js";

const consumerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  role: { type: String, default: "CONSUMER" }
}, { timestamps: true });



export default mongoose.model("Consumer", consumerSchema);
