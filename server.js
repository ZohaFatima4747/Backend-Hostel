const express = require("express");
const cors = require("cors");
const connectDB = require("./conn/connection");

const studentRoutes = require("./routes/studentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// DB connect
connectDB();

// routes
app.use("/api/students", studentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Hostel Payment Backend Running 🚀");
});

module.exports = app; // 🔴 VERY IMPORTANT (NO listen)
