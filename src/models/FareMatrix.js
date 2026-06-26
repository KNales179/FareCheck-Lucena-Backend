const mongoose = require("mongoose");

const fareMatrixSchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      required: true,
      unique: true,
    },

    baseFare: {
      type: Number,
      required: true,
      min: 0,
    },

    includedKm: {
      type: Number,
      required: true,
      min: 0,
    },

    perKm: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    source: {
      type: String,
      default: "manual",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FareMatrix", fareMatrixSchema);