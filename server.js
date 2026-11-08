
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000"
}));
app.use(express.json({ limit: "20kb" }));

app.get("/api/status", (req, res) => {
  res.json({
    app: "K.S SOCIAL",
    status: "Backend running",
    version: "1.0.0"
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "API route not found"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`K.S SOCIAL server running on port ${PORT}`);
});
