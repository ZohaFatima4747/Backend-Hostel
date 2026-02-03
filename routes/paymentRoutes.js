const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "hostelPaymentSecret123";

// =====================
// Student Auth Middleware
// =====================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    req.student = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// =====================
// Submit Payment
// =====================
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { paymentType, cashNote, screenshotUrl, month } = req.body;
    
    // Validation
    if (!month) {
      return res.status(400).json({ error: "Month is required" });
    }
    
    if (!paymentType || !["Cash", "Online"].includes(paymentType)) {
      return res.status(400).json({ error: "Valid payment type is required" });
    }
    
    if (paymentType === "Cash" && !cashNote) {
      return res.status(400).json({ error: "Cash note is required for cash payments" });
    }
    
    if (paymentType === "Online" && !screenshotUrl) {
      return res.status(400).json({ error: "Screenshot is required for online payments" });
    }
    
    const year = new Date().getFullYear();

    let payment = await Payment.findOne({ studentId: req.student.id, month, year });

    if (payment && payment.status !== "Not Received") {
      return res.status(400).json({ error: "Payment already submitted" });
    }

    if (payment && payment.status === "Not Received") {
      // Update previous payment
      payment.paymentType = paymentType;
      payment.cashNote = paymentType === "Cash" ? cashNote : "";
      payment.screenshotUrl = paymentType === "Online" ? screenshotUrl : "";
      payment.status = "Pending";
      await payment.save();
      return res.json({ message: "Payment resubmitted", payment });
    }

    // New payment
    payment = new Payment({
      studentId: req.student.id,
      month,
      year,
      paymentType,
      cashNote: paymentType === "Cash" ? cashNote : "",
      screenshotUrl: paymentType === "Online" ? screenshotUrl : "",
      status: "Pending",
    });

    await payment.save();
    res.json({ message: "Payment submitted", payment });
  } catch (err) {
    console.error("Payment submission error:", err);
    res.status(500).json({ error: "Payment submission failed" });
  }
});


// =====================
// Get My Payments
// =====================
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.student.id });
    res.json(payments);
  } catch (err) {
    console.error("Get payments error:", err);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

module.exports = router;
