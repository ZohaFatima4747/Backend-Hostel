const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

router.get("/", async (req, res) => {
  try {
    if (!Student) throw new Error("Student model missing");
    const students = await Student.find({}, "name roomNo SecurityFee");
    res.json({ success: true, students });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
