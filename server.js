const express = require("express");
const cors = require("cors");
const connectDB = require("./conn/connection");

const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* =========================
   ✅ CORS — NO * — VERSEL SAFE
   ========================= */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://care-house.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

module.exports = app;
