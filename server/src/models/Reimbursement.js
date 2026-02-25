const mongoose = require("mongoose");

const reimbursementSchema = new mongoose.Schema(
  {
    employeeId: {
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
      enum: ["TRAVEL", "FOOD", "STAY", "OTHER"],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    billFile: {
      bucket: {
        type: String,
        default: "reimbursement",
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
      mimeType: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: true,
      },
      size: Number,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reimbursement", reimbursementSchema);
