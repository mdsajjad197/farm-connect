import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: String,
  city: String,
  role: { type: String, default: "USER" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
