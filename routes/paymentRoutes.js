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
  const { paymentType, cashNote, screenshotUrl, month } = req.body;
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
});


// =====================
// Get My Payments
// =====================
router.get("/my", authMiddleware, async (req, res) => {
  const payments = await Payment.find({ studentId: req.student.id });
  res.json(payments);
});

module.exports = router;
