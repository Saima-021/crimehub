const jwt = require("jsonwebtoken");

const verifyOfficer = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Strictly check for elevated roles
    if (decoded.role !== "OFFICER" && decoded.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Access denied. Authorities only." });
    }

    req.officer = decoded; // Contains id, role, and assignedDepartment
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = verifyOfficer;