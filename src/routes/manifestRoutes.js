const express = require("express");
const FareMatrix = require("../models/FareMatrix");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const latestFareMatrix = await FareMatrix.findOne({ isActive: true }).sort({
      version: -1,
    });

    const lucenaMapStyleUrl = process.env.LUCENA_MAP_STYLE_URL || "";

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
          enabled: Boolean(lucenaMapStyleUrl),
          version: Number(process.env.LUCENA_MAP_VERSION || 1),
          styleUrl: lucenaMapStyleUrl || null,

          // [west, south, east, north]
          bounds: [121.56, 13.88, 121.67, 13.98],

          minZoom: Number(process.env.LUCENA_MAP_MIN_ZOOM || 12),
          maxZoom: Number(process.env.LUCENA_MAP_MAX_ZOOM || 16),

          packName: "farecheck-lucena-map",
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