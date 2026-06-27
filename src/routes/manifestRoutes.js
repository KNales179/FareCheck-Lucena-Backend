const express = require("express");
const crypto = require("crypto");
const FareMatrix = require("../models/FareMatrix");
const placesIndex = require("../../data/embedded-lucena-places.json");
const { getRoutingGraphMetadata } = require("../utils/routingGraphMetadata");

const router = express.Router();

function createHash(data) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}

function getPlacesMetadata() {
  const places = Array.isArray(placesIndex.places) ? placesIndex.places : [];

  return {
    enabled: true,
    version: Number(placesIndex.version || 1),
    dataType: placesIndex.dataType || "lucena_places_search_index",
    source: placesIndex.source || "OpenStreetMap + cleaned Lucena places",
    generatedAt: placesIndex.generatedAt || null,
    count: places.length,
    hash: createHash({
      version: placesIndex.version,
      generatedAt: placesIndex.generatedAt,
      places,
    }),
    endpoint: "/api/v1/places/latest",
  };
}

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

        places: getPlacesMetadata(),

        routingGraph: getRoutingGraphMetadata(),

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