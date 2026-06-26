const express = require("express");
const FareMatrix = require("../models/FareMatrix");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const latestFareMatrix = await FareMatrix.findOne({ isActive: true }).sort({
      version: -1,
    });

    res.json({
      success: true,
      data: {
        appDataVersion: Number(process.env.APP_DATA_VERSION || 1),
        fareMatrix: latestFareMatrix
          ? {
              version: latestFareMatrix.version,
              updatedAt: latestFareMatrix.updatedAt,
            }
          : null,
        minimumSupportedAppVersion: "1.0.0",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch manifest",
      error: error.message,
    });
  }
});

module.exports = router;