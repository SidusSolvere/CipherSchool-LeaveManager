const mongoose = require("mongoose");

const reimbursementSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["TRAVEL", "FOOD", "OFFICE", "OTHER"],
      required: true,
    },

    description: String,

    receiptPath: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reimbursement", reimbursementSchema);