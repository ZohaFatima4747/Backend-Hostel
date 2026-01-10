const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SECRET for JWT
const JWT_SECRET = "hostelPaymentSecret123"; // temporary, later move to env

// Login route
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    const student = await Student.findOne({ name });
    if (!student) return res.status(400).json({ error: "Student not found" });

    // Compare passwords
    const isMatch = student.password === password; // simple comparison
    // For hashed password use:
    // const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

    // Create JWT
    const token = jwt.sign(
      { id: student._id, name: student.name, roomNo: student.roomNo },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
