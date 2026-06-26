const express = require("express");
const FareMatrix = require("../models/FareMatrix");

const router = express.Router();

router.get("/latest", async (req, res) => {
  try {
    const latestFareMatrix = await FareMatrix.findOne({ isActive: true }).sort({
      version: -1,
    });

    if (!latestFareMatrix) {
      return res.status(404).json({
        success: false,
        message: "No active fare matrix found",
      });
    }

    res.json({
      success: true,
      data: latestFareMatrix,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest fare matrix",
      error: error.message,
    });
  }
});

module.exports = router;