const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    month: String,
    year: Number,

    paymentType: {
      type: String,
      enum: ["Cash", "Online"],
      required: true,
    },

    cashNote: String,
    screenshotUrl: String,

    status: {
      type: String,
      default: "Pending", // ❗ NO EMOJI
    },

    adminRemarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
