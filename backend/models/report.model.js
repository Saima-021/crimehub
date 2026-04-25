const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  reportType: { type: String, required: true }, 
  incidentDate: { type: String, required: true },
  incidentTime: { type: String, required: true },
  description: { type: String, required: true },
  platform: { type: String, required: true },
  contactNumber: { type: String, required: true },
  contactEmail: { type: String, required: true },
  
  // Original evidence submitted by user
  proof: [{ type: String }], 
  
  // ✅ NEW: Evidence uploaded LATER after officer requests it (Option B)
  additionalProof: [{ type: String }], 

  // ✅ NEW: Officer's internal notes or feedback to the user
  remarks: { type: String, default: "" },

  // ✅ NEW: Tracks which officer is currently handling this case
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' },

  // ✅ ENHANCED: Added more specific statuses
  status: { 
    type: String, 
    enum: ["Pending", "Under Investigation", "Action Required", "Closed"],
    default: "Pending" 
  } 
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);