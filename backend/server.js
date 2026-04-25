const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const chatbotRoute = require("./routes/chatbot.route");
const connectDB = require("./config/db");

// 🔥 MATCH THESE TO YOUR ACTUAL FILENAMES ON DISK
const authRoutes = require("./routes/auth.routes"); 
const reportRoutes = require("./routes/report.route"); 
const officerRoutes = require("./routes/officerRoutes");
const spamRoutes = require("./routes/spamRoutes");
const app = express(); 

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

// Serving the uploads folder so you can view images in the browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/chatbot", chatbotRoute);
/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes); // Enables http://localhost:5000/api/reports/add
app.use("/api/spam", spamRoutes);
/* ---------------- TEST ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("CrimeHub Backend Running ✅");
});


// Officer Lane (High Security)
app.use("/api/officer", officerRoutes);
/* ---------------- DATABASE ---------------- */
connectDB();

/* ---------------- SERVER ---------------- */
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});