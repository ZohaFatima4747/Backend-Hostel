const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET all students (public)
router.get("/", async (req, res, next) => {
  try {
    // Include SecurityFee in the response
    const students = await Student.find({}, "name roomNo SecurityFee");
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    next(err); // sends to global error handler
  }
});

module.exports = router;
