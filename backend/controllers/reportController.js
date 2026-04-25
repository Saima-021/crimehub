const Report = require("../models/report.model");

const addReport = async (req, res) => {
  try {
    const { reportType } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded."
      });
    }

    const imageUrls = req.files.map(file =>
      file.path.split(/[\\/]/).pop()
    );

    const newReport = new Report({
      ...req.body,
      proof: imageUrls,
      userId: req.user.id,
      userName: req.user.fullName
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: "Report filed successfully."
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const addMoreProof = async (req, res) => {
  try {
    const reportId = req.params.id;
    const userId = req.user.id; 

    const report = await Report.findOne({ _id: reportId, userId: userId });
    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found or unauthorized" });
    }

    const newFiles = req.files.map(file => file.path.split(/[\\/]/).pop());
    report.proof.push(...newFiles);
    report.status = "Pending"; 
    
    await report.save();
    res.json({ success: true, message: "Proof updated.", proof: report.proof });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUserReports = async (req, res) => {
  try {
    const userId = req.user.id; // From authMiddleware
    const reports = await Report.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  addReport, 
  addMoreProof,
  getUserReports 
};