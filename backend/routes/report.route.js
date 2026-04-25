const express = require("express");
const router = express.Router();

const { addReport, addMoreProof, getUserReports } = require("../controllers/reportController");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload");
const validateReport = require("../middleware/report.validation");

// ✅ FIXED: Added protect here
router.post("/add", protect, upload.array("proof", 5), validateReport, addReport);

router.put('/add-proof/:id', protect, upload.array('additionalProof'), addMoreProof);

router.get("/my-reports", protect, getUserReports);

module.exports = router;