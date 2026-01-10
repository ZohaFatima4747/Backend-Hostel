const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    SecurityFee: { type: String, required: true, default: "Null" }, // updated
    roomNo: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
