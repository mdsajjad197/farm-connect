import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Check if we already have a connection
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    // Do NOT exit process in serverless environment
    // process.exit(1); 
    throw error; // Let the caller handle it
  }
};

export default connectDB;
