const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔥 PUBLIC FOLDER SERVE
app.use(express.static(path.join(__dirname, "public")));

// ROOT → LOGIN PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// PANEL PAGE
app.get("/panel.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "panel.html"));
});

// ADMIN PAGE
app.get("/admin.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
