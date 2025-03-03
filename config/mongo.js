import mongoose from "mongoose";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Get environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}

const initializeMongo = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("[MongoDB] Connected to MongoDB");

    // Connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error("[MongoDB] Connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("[MongoDB] Disconnected from MongoDB");
    });
  } catch (error) {
    console.error("[MongoDB] Error in connection setup:", error);
    process.exit(1);
  }
};

// Initialize connection
try {
  initializeMongo();
} catch (error) {
  console.error("[MongoDB] Failed to initialize:", error);
  process.exit(1);
}

export default mongoose;
