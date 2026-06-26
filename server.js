require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./src/config/db");

const healthRoutes = require("./src/routes/healthRoutes");
const fareMatrixRoutes = require("./src/routes/fareMatrixRoutes");
const manifestRoutes = require("./src/routes/manifestRoutes");
const adminFareMatrixRoutes = require("./src/routes/adminFareMatrixRoutes");

const app = express();

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/health", healthRoutes);
app.use("/api/v1/fare-matrix", fareMatrixRoutes);
app.use("/api/v1/manifest", manifestRoutes);
app.use("/api/v1/admin", adminFareMatrixRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FareCheck Lucena backend running on port ${PORT}`);
});