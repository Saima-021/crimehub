const Officer = require("../models/officer.model");
const jwt = require("jsonwebtoken");
const AuditLog = require("../models/auditLog.model");
const Report = require("../models/report.model"); 

const createLog = async (performerId, action, targetType, targetName, details) => {
  try {
    await AuditLog.create({ performer: performerId, action, targetType, targetName, details });
  } catch (err) {
    console.error("Audit Log Error:", err.message);
  }
};


exports.officerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const officer = await Officer.findOne({ email });
    if (!officer || officer.password !== password) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    if (!officer.isActive) {
      return res.status(403).json({ success: false, message: "Account suspended." });
    }
    const token = jwt.sign(
      { id: officer._id, fullName: officer.fullName, badgeNumber: officer.badgeNumber, role: officer.role, dept: officer.assignedDepartment },
      process.env.JWT_SECRET, { expiresIn: "8h" }
    );
    return res.json({ success: true, token, officer: { fullName: officer.fullName, badgeNumber: officer.badgeNumber, assignedDepartment: officer.assignedDepartment, role: officer.role } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


exports.createOfficer = async (req, res) => {
  try {
    const newOfficer = new Officer(req.body);
    await newOfficer.save();
    await createLog(req.officer.id, "CREATE_OFFICER", "OFFICER", newOfficer.fullName, `Added to ${newOfficer.assignedDepartment}`);
    return res.status(201).json({ success: true, message: "Officer created" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};


exports.toggleOfficerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const officer = await Officer.findById(id);
    if (!officer || officer.role === 'SUPER_ADMIN') return res.status(403).json({ success: false, message: "Denied" });
    officer.isActive = !officer.isActive;
    await officer.save();
    await createLog(req.officer.id, officer.isActive ? "RESTORE_OFFICER" : "SUSPEND_OFFICER", "OFFICER", officer.fullName, `Badge: ${officer.badgeNumber}`);
    return res.json({ success: true, isActive: officer.isActive });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


exports.getAllOfficers = async (req, res) => {
  try {
    const officers = await Officer.find({}, "-password");
    res.json({ success: true, data: officers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getSystemLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find().populate("performer", "fullName badgeNumber").sort({ timestamp: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyDepartmentReports = async (req, res) => {
    try {
        const { dept } = req.officer;
        const reports = await Report.find({ reportType: dept });
        res.json({ success: true, data: reports });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const { role, dept } = req.officer;

    // KEEPING YOUR ORIGINAL LOGIC
    const query = role === "SUPER_ADMIN" ? {} : { reportType: dept };

    const totalReports = await Report.countDocuments(query);

    const solvedCases = await Report.countDocuments({
      ...query,
      status: { $in: ["Closed", "Solved"] }
    });

    // NEW: Graph data (GLOBAL for both roles)
    const crimeDistribution = await Report.aggregate([
      {
        $group: {
          _id: "$reportType",
          count: { $sum: 1 }
        }
      }
    ]);

    return res.json({
      success: true,
      data: {
        totalReports,
        solvedCases,
        crimeDistribution
      }
    });

  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    return res.status(500).json({
      success: false,
      message: "Error in stats"
    });
  }
};

exports.getAssignedCases = async (req, res) => {
  try {
    const { role, dept } = req.officer;
    const { search, status } = req.body; 

  
    let query = role === "SUPER_ADMIN" ? {} : { reportType: dept };

  
    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { userName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const cases = await Report.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(100);

    return res.json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (err) {
    console.error("Fetch Cases Error:", err);
    return res.status(500).json({ success: false, message: "Could not retrieve cases" });
  }
};
exports.updateOfficer = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, badgeNumber, assignedDepartment } = req.body;

    const officer = await Officer.findById(id);

    if (!officer) {
      return res.status(404).json({ success: false, message: "Officer not found" });
    }

    if (officer.role === "SUPER_ADMIN") {
      return res.status(403).json({ success: false, message: "Cannot edit SUPER_ADMIN" });
    }

    officer.fullName = fullName || officer.fullName;
    officer.email = email || officer.email;
    officer.badgeNumber = badgeNumber || officer.badgeNumber;
    officer.assignedDepartment = assignedDepartment || officer.assignedDepartment;

    await officer.save();

    await createLog(
      req.officer.id,
      "EDIT_OFFICER",
      "OFFICER",
      officer.fullName,
      `Officer details updated`
    );

    res.json({ success: true, message: "Officer updated successfully", officer });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.deleteOfficer = async (req, res) => {
  try {
    const { id } = req.params;

    const officer = await Officer.findById(id);

    if (!officer) {
      return res.status(404).json({ success: false, message: "Officer not found" });
    }

    if (officer.role === "SUPER_ADMIN") {
      return res.status(403).json({ success: false, message: "Cannot delete SUPER_ADMIN" });
    }

    await Officer.findByIdAndDelete(id);

    await createLog(
      req.officer.id,
      "DELETE_OFFICER",
      "OFFICER",
      officer.fullName,
      `Badge: ${officer.badgeNumber}`
    );

    res.json({ success: true, message: "Officer deleted successfully" });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// backend/controllers/officerController.js

// backend/controllers/officerController.js

exports.updateCaseStatus = async (req, res) => {
  try {
    const { reportId, newStatus, remarks } = req.body;
    const officerId = req.officer.id;
    const officerName = req.officer.fullName; 

    // 1. Fetch the report first to check its CURRENT status
    const currentReport = await Report.findById(reportId);
    if (!currentReport) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const previousStatus = currentReport.status;

    // 2. Perform the update
    const updatedReport = await Report.findByIdAndUpdate(
      reportId,
      { 
        status: newStatus, 
        remarks: remarks || "" 
      },
      { new: true }
    );

    // 3. Logic to determine the specific log action type
    let actionType = "UPDATE_REPORT_STATUS";
    
    if (newStatus === "Under Investigation") {
      // If moving from 'New' to investigation, it's an OPENING
      // If moving from 'Closed' to investigation, it's a REOPENING
      actionType = previousStatus === "New" ? "OPEN_NEW_CASE" : "REOPEN_CASE";
    } else if (newStatus === "Closed") {
      actionType = "CLOSE_CASE_FILE";
    }

    await createLog(
      officerId, 
      actionType, 
      "REPORT", 
      reportId, 
      `Officer ${officerName} moved case from ${previousStatus} to ${newStatus}. Remarks: ${remarks || 'None'}`
    );

    res.json({ 
      success: true, 
      message: `Case successfully updated to ${newStatus}`,
      data: updatedReport 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};