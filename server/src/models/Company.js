const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    emailDomain: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    governmentId: {
      idType: {
        type: String,
        required: true,
        enum: ["CIN", "LLPIN", "PAN", "GSTIN", "UDYAM", "SEBI", "OTHER"],
      },

      idValue: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Company", companySchema);
