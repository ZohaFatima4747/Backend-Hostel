const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    // Connection already exists → reuse it
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(
      "mongodb+srv://Connect-form:contactform00o@cluster0.b9afhru.mongodb.net/Hostel",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    ).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected ✅");
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};

module.exports = connectDB;
