const express = require("express");
const crypto = require("crypto");

const router = express.Router();

// Admin authentication middleware.
// Must be replaced with verified Supabase JWT authentication.
function requireAdmin(req, res, next) {
  return res.status(503).json({
    error: "Admin authentication is not configured yet."
  });
}

// Create invitation
router.post("/create", requireAdmin, async (req, res) => {
  try {
    const code =
      "KS-" +
      crypto.randomBytes(8).toString("hex").toUpperCase();

    res.status(501).json({
      error: "Database integration is not configured yet."
    });
  } catch (error) {
    res.status(500).json({
      error: "Could not create invitation."
    });
  }
});

// Check invitation
router.post("/validate", async (req, res) => {
  return res.status(503).json({
    valid: false,
    error: "Invitation validation is not configured yet."
  });
});

module.exports = router;

