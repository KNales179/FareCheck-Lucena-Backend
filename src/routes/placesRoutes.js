const express = require("express");
const crypto = require("crypto");
const placesIndex = require("../../data/embedded-lucena-places.json");

const router = express.Router();

function createHash(data) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");
}

function getPlacesPayload() {
  const places = Array.isArray(placesIndex.places) ? placesIndex.places : [];

  const metadata = {
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

  return {
    ...placesIndex,
    metadata,
  };
}

router.get("/latest", (req, res) => {
  try {
    const payload = getPlacesPayload();

    if (!Array.isArray(payload.places)) {
      return res.status(500).json({
        success: false,
        message: "Places data is invalid: places must be an array.",
      });
    }

    return res.json({
      success: true,
      data: payload,
    });
  } catch (error) {
    console.error("[FareCheck Places] Failed to load latest places:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load Lucena places data.",
    });
  }
});

router.get("/metadata", (req, res) => {
  try {
    const payload = getPlacesPayload();

    return res.json({
      success: true,
      data: payload.metadata,
    });
  } catch (error) {
    console.error("[FareCheck Places] Failed to load places metadata:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load Lucena places metadata.",
    });
  }
});

module.exports = router;