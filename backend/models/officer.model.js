const mongoose = require("mongoose");

const officerSchema = new mongoose.Schema({
  badgeNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["OFFICER", "SUPER_ADMIN"], 
    default: "OFFICER" 
  },
  
  assignedDepartment: { 
    type: String, 
    required: true,
    enum: [
      "Online Fraud", 
      "Identity Theft", 
      "Cyber Harassment / Bullying",
      "Phishing / Scam", 
      "Social Media Crime", 
      "Financial Fraud",
      "Hacking / Account Takeover", 
      "Fake Profile / Impersonation", 
      "Other"
    ]
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Officer", officerSchema);