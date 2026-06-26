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

        lucenaMap: {
          enabled: Boolean(process.env.LUCENA_MAP_STYLE_URL),
          version: Number(process.env.LUCENA_MAP_VERSION || 1),
          styleUrl: process.env.LUCENA_MAP_STYLE_URL || null,
          bounds: [121.56, 13.88, 121.67, 13.98],
          minZoom: 12,
          maxZoom: 16,
          packName: "lucena-map",
        },

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