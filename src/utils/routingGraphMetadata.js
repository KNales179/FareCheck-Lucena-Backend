const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROUTING_GRAPH_VERSION = Number(process.env.ROUTING_GRAPH_VERSION || 1);
const ROUTING_GRAPH_FILE_NAME =
  process.env.ROUTING_GRAPH_FILE_NAME ||
  `lucena-gh-v${ROUTING_GRAPH_VERSION}.zip`;

const ROUTING_GRAPH_FOLDER = path.join(__dirname, "../../data/routing");
const ROUTING_GRAPH_FILE_PATH = path.join(
  ROUTING_GRAPH_FOLDER,
  ROUTING_GRAPH_FILE_NAME
);

function createFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);

  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

function getRoutingGraphMetadata() {
  const fileExists = fs.existsSync(ROUTING_GRAPH_FILE_PATH);
  const stat = fileExists ? fs.statSync(ROUTING_GRAPH_FILE_PATH) : null;

  return {
    enabled: fileExists,
    version: ROUTING_GRAPH_VERSION,
    dataType: "graphhopper-cache",
    graphHopperVersion: process.env.ROUTING_GRAPH_GRAPHHOPPER_VERSION || "5.3",
    profile: process.env.ROUTING_GRAPH_PROFILE || "car",
    source: process.env.ROUTING_GRAPH_SOURCE || "OpenStreetMap / GraphHopper",
    generatedAt:
      process.env.ROUTING_GRAPH_GENERATED_AT ||
      "2026-06-28T04:08:00+08:00",
    fileName: ROUTING_GRAPH_FILE_NAME,
    sizeBytes: stat ? stat.size : 0,
    sha256: fileExists ? createFileHash(ROUTING_GRAPH_FILE_PATH) : null,
    endpoint: "/api/v1/routing/graphhopper/latest",
  };
}

module.exports = {
  getRoutingGraphMetadata,
  ROUTING_GRAPH_FILE_PATH,
};