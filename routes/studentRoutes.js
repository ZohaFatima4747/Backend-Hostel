// studentRoutes.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET all students (public)
router.get("/", async (req, res) => {
  try {
    // Include SecurityFee in the response
    const students = await Student.find({}, "name roomNo SecurityFee");
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
