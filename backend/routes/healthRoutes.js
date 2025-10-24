// routes/healthRoutes.js
import express from "express";

const router = express.Router();

// Endpoint público de healthcheck
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend OK",
    timestamp: new Date().toISOString(),
  });
});

export default router;
