require("dotenv").config();

const connectDB = require("../config/db");
const FareMatrix = require("../models/FareMatrix");

async function seedFareMatrix() {
  try {
    await connectDB();

    const existingCount = await FareMatrix.countDocuments();

    if (existingCount > 0) {
      console.log("Seed skipped: fare matrix already exists.");
      console.log("This prevents overwriting updated fare matrices.");
      process.exit(0);
    }

    const fareMatrix = await FareMatrix.create({
      version: 1,
      baseFare: 20,
      includedKm: 2,
      perKm: 5,
      discountPercent: 20,
      isActive: true,
      source: "TFRO/City Fare Matrix",
      notes: "Initial official fare matrix for FareCheck Lucena.",
    });

    console.log("Initial fare matrix seeded:");
    console.log(fareMatrix);

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seedFareMatrix();