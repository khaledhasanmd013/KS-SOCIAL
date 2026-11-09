const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN ||
    "http://localhost:3000"
}));

app.use(express.json({
  limit: "20kb"
}));

// Supabase connection
const supabaseAdmin = require("./supabase-server");

// Backend status
app.get("/api/status", (req, res) => {
  res.json({
    app: "K.S SOCIAL",
    status: "Backend running",
    databaseClient: supabaseAdmin
      ? "Supabase client loaded"
      : "Not connected",
    version: "1.0.0"
  });
});

// Real database connection test
app.get("/api/db-check", async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from("profiles")
      .select("id", {
        count: "exact",
        head: true
      });

    if (error) {
      console.error("Database check failed.");
      return res.status(503).json({
        app: "K.S SOCIAL",
        database: "Not connected",
        message: "Database query failed."
      });
    }

    return res.json({
      app: "K.S SOCIAL",
      database: "Connected",
      table: "profiles",
      status: "Database query successful"
    });

  } catch (error) {
    return res.status(503).json({
      database: "Not connected",
      message: "Database check failed."
    });
  }
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "API route not found"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `K.S SOCIAL server running on port ${PORT}`
  );
});
