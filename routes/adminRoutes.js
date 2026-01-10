const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "hostelPaymentSecret123";

// =====================
// Admin Login
// =====================
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const admin = await Admin.findOne({ name });
    if (!admin) return res.status(400).json({ error: "Admin not found" });
    if (admin.password !== password)
      return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Admin login successful", token, admin });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// =====================
// Admin Auth Middleware
// =====================
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// =====================
// Get All Payments
// =====================
router.get("/payments", adminAuth, async (req, res) => {
  const payments = await Payment.find()
    .populate("studentId", "name roomNo SecurityFee");
  res.json(payments);
});

// =====================
// Update Payment Status (ADMIN)
// =====================
router.put("/payments/:id/status", adminAuth, async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    payment.status = status;
    payment.adminRemarks = adminRemarks || "";

    await payment.save();

    const updatedPayment = await Payment.findById(payment._id)
      .populate("studentId", "name roomNo SecurityFee");

    res.json({ payment: updatedPayment });
  } catch (err) {
    console.error("ADMIN UPDATE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
