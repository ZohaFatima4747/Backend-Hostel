const mongoose = require("mongoose");

let isConnected = false; // cache for Vercel serverless

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err; // ensures Vercel logs the error
  }
};

module.exports = connectDB;
