const express = require("express");
const router = express.Router();
const { 
  officerLogin, 
  getMyDepartmentReports, 
  createOfficer,
  getAllOfficers, 
  toggleOfficerStatus,
  getSystemLogs,
  getDashboardStats, 
  getAssignedCases,
  updateCaseStatus,
   updateOfficer,
   deleteOfficer
} = require("../controllers/officerController");

const verifyOfficer = require("../middleware/officerAuth");

// --- PUBLIC ROUTES ---
router.post("/login", officerLogin);
router.post("/delete-officer/:id", verifyOfficer, deleteOfficer);
// --- PROTECTED ROUTES (All use POST as per your request) ---
router.post("/create-officer", verifyOfficer, createOfficer);
router.post("/my-reports", verifyOfficer, getMyDepartmentReports);
router.post("/assigned-cases", verifyOfficer, getAssignedCases); 
router.post("/all-officers", verifyOfficer, getAllOfficers); 
router.post("/toggle-status/:id", verifyOfficer, toggleOfficerStatus);
router.post("/system-logs", verifyOfficer, getSystemLogs);
router.post("/dashboard-stats", verifyOfficer, getDashboardStats);
router.post("/update-case", verifyOfficer, updateCaseStatus);
router.post("/update-officer/:id", verifyOfficer, updateOfficer);
module.exports = router;