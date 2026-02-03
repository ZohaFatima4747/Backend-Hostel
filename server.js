const express = require("express");
const cors = require("cors");
const connectDB = require("./conn/connection");

const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://care-house.vercel.app",
];

// 🥇 Global CORS middleware (works on Vercel)
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Body parser
app.use(express.json());

// 🔴 Connect to DB
connectDB().then(() => console.log("MongoDB connected ✅"))
           .catch(err => console.error("DB connection failed:", err));

// ✅ Routes
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Hostel Payment Backend Running 🚀");
});

// 🥉 Global error handler
app.use((err, req, res, next) => {
  if (err.message === "CORS not allowed") {
    return res.status(403).json({ success: false, message: "CORS blocked" });
  }
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error"
  });
});

module.exports = app; // Vercel-ready
