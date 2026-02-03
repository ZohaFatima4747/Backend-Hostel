const express = require("express");
const cors = require("cors");
const connectDB = require("./conn/connection");

const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ✅ Allowed origins (add your frontend URLs here)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://care-house.vercel.app",
];

// 🥇 CORS middleware (future-proof)
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🚀 Handle preflight for all routes
app.options("*", cors());

// ✅ Body parser
app.use(express.json());

// 🔴 DB connect
connectDB();

// ✅ Routes (keep route hierarchy intact)
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Hostel Payment Backend Running 🚀");
});

// 🥉 Global error handler (CORS-safe + production-ready)
app.use((err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({ success: false, message: "CORS blocked" });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Server error" });
});

module.exports = app; // 🔴 No listen here (Vercel ready)
