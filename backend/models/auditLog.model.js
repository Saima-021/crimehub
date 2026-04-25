const mongoose = require("mongoose");
const auditLogSchema = new mongoose.Schema({
  performer: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer', required: true },
  action: { type: String, required: true },
  targetType: { type: String },
  targetName: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});
module.exports = mongoose.model("AuditLog", auditLogSchema);
