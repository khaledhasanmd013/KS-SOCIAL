
const express = require("express");
const crypto = require("crypto");

const router = express.Router();
const supabaseAdmin = require("./supabase-server");

// Verify Admin
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required."
      });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } =
      await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid login session."
      });
    }

    if (data.user.app_metadata?.role !== "admin") {
      return res.status(403).json({
        error: "Admin access required."
      });
    }

    req.adminUser = data.user;
    next();

  } catch (error) {
    return res.status(401).json({
      error: "Authentication failed."
    });
  }
}

// Verify logged-in user
async function requireUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Login required."
      });
    }

    const token = authHeader.split(" ")[1];

    const { data, error } =
      await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid login session."
      });
    }

    req.user = data.user;
    next();

  } catch (error) {
    return res.status(401).json({
      error: "Authentication failed."
    });
  }
}

// Create invitation - Admin only
router.post("/create", requireAdmin, async (req, res) => {
  try {
    const code =
      "KS-" +
      crypto.randomBytes(8).toString("hex").toUpperCase();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error } = await supabaseAdmin
      .from("invitations")
      .insert({
        code,
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      return res.status(500).json({
        error: "Could not create invitation."
      });
    }

    return res.status(201).json({
      success: true,
      code,
      expires_at: expiresAt.toISOString()
    });

  } catch (error) {
    return res.status(500).json({
      error: "Invitation creation failed."
    });
  }
});

// Validate invitation
router.post("/validate", async (req, res) => {
  try {
    const code =
      typeof req.body.code === "string"
        ? req.body.code.trim().toUpperCase()
        : "";

    if (!/^KS-[A-F0-9]{16}$/.test(code)) {
      return res.status(400).json({
        valid: false,
        error: "Invalid invitation code."
      });
    }

    const { data, error } = await supabaseAdmin
      .from("invitations")
      .select("code, expires_at, used_at, revoked")
      .eq("code", code)
      .maybeSingle();

    if (error || !data) {
      return res.json({
        valid: false,
        message: "Invitation is invalid."
      });
    }

    const expired =
      data.expires_at &&
      new Date(data.expires_at).getTime() <= Date.now();

    if (data.revoked || data.used_at || expired) {
      return res.json({
        valid: false,
        message: "Invitation is unavailable."
      });
    }

    return res.json({
      valid: true,
      message: "Invitation is valid."
    });

  } catch (error) {
    return res.status(500).json({
      valid: false,
      error: "Invitation validation failed."
    });
  }
});

// Redeem invitation - Logged-in user
router.post("/redeem", requireUser, async (req, res) => {
  try {
    const code =
      typeof req.body.code === "string"
        ? req.body.code.trim().toUpperCase()
        : "";

    if (!/^KS-[A-F0-9]{16}$/.test(code)) {
      return res.status(400).json({
        success: false,
        error: "Invalid invitation code."
      });
    }

    const { data, error } = await supabaseAdmin
      .rpc("redeem_invitation", {
        p_code: code
      });

    if (error) {
      return res.status(500).json({
        success: false,
        error: "Invitation redemption failed."
      });
    }

    if (data !== true) {
      return res.status(400).json({
        success: false,
        error: "Invitation is invalid, expired, used or revoked."
      });
    }

    return res.json({
      success: true,
      message: "Invitation redeemed successfully."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Redemption failed."
    });
  }
});

module.exports = router;

