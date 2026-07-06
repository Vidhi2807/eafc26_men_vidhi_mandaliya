const express = require("express");
const cors = require("cors");
const playerRoutes = require("./src/routes/playerRoutes");
const requestTimer = require("./src/middlewares/requestTimer");
const loggerMiddleware = require("./src/middlewares/loggerMiddleware");
const errorMiddleware = require("./src/middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

// Performance monitoring & logging middlewares
app.use(requestTimer);
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EAFC 26 Player Analytics API is running",
  });
});

// Mount routes
app.use("/players", playerRoutes);

// Global Error Handler Middleware
app.use(errorMiddleware);

module.exports = app;
