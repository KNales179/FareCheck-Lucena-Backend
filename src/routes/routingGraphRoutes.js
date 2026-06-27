const express = require("express");
const fs = require("fs");

const {
  getRoutingGraphMetadata,
  ROUTING_GRAPH_FILE_PATH,
} = require("../utils/routingGraphMetadata");

const router = express.Router();

router.get("/metadata", (req, res) => {
  try {
    const metadata = getRoutingGraphMetadata();

    return res.json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    console.error("[FareCheck RoutingGraph] Failed to load metadata:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load routing graph metadata.",
      error: error.message,
    });
  }
});

router.get("/latest", (req, res) => {
  try {
    const metadata = getRoutingGraphMetadata();

    if (!metadata.enabled || !fs.existsSync(ROUTING_GRAPH_FILE_PATH)) {
      return res.status(404).json({
        success: false,
        message: "Routing graph file is not available.",
      });
    }

    res.setHeader("X-FareCheck-Graph-Version", String(metadata.version));
    res.setHeader("X-FareCheck-Graph-SHA256", metadata.sha256 || "");
    res.setHeader("X-FareCheck-Graph-Size", String(metadata.sizeBytes));
    res.setHeader("Content-Type", "application/zip");

    return res.download(
      ROUTING_GRAPH_FILE_PATH,
      metadata.fileName,
      (error) => {
        if (error) {
          console.error(
            "[FareCheck RoutingGraph] Failed to send graph zip:",
            error
          );
        }
      }
    );
  } catch (error) {
    console.error("[FareCheck RoutingGraph] Failed to download latest:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download routing graph.",
      error: error.message,
    });
  }
});

module.exports = router;