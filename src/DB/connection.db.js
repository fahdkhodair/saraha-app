import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const uri = process.env.DB_URL
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS:5000
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
