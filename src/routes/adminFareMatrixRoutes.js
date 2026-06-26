const express = require("express");
const FareMatrix = require("../models/FareMatrix");

const router = express.Router();

function requireAdminKey(req, res, next) {
  const adminKey = req.headers["x-admin-key"];

  if (!process.env.ADMIN_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "ADMIN_API_KEY is not configured",
    });
  }

  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
}

router.post("/fare-matrix", requireAdminKey, async (req, res) => {
  try {
    const { baseFare, includedKm, perKm, discountPercent, source, notes } =
      req.body;

    if (
      typeof baseFare !== "number" ||
      typeof includedKm !== "number" ||
      typeof perKm !== "number" ||
      typeof discountPercent !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "baseFare, includedKm, perKm, and discountPercent must be numbers",
      });
    }

    const latestFareMatrix = await FareMatrix.findOne().sort({ version: -1 });

    const nextVersion = latestFareMatrix ? latestFareMatrix.version + 1 : 1;

    await FareMatrix.updateMany({}, { isActive: false });

    const newFareMatrix = await FareMatrix.create({
      version: nextVersion,
      baseFare,
      includedKm,
      perKm,
      discountPercent,
      isActive: true,
      source: source || "TFRO/City Fare Matrix",
      notes: notes || "",
    });

    res.status(201).json({
      success: true,
      message: "Fare matrix updated successfully",
      data: newFareMatrix,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update fare matrix",
      error: error.message,
    });
  }
});

module.exports = router;