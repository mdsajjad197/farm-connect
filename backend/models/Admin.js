import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: "ADMIN" }
});

export default mongoose.model("Admin", adminSchema);
