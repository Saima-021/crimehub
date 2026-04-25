const validateReport = (req, res, next) => {
  const { 
    incidentDate, 
    incidentTime, 
    contactNumber, 
    contactEmail, 
    description 
  } = req.body;

  // 1. Get Current Date and Time
  const now = new Date();
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const currentTime = now.getHours() + ":" + now.getMinutes();

  // 2. Validate Date (Cannot be in the future)
  if (incidentDate > today) {
    return res.status(400).json({ success: false, message: "Incident date cannot be in the future!" });
  }

  // 3. Validate Time (If date is today, time cannot be in the future)
  if (incidentDate === today && incidentTime < currentTime) {
    return res.status(400).json({ success: false, message: "Incident time cannot be in the future!" });
  }

  // 4. Validate Contact Number (Must be 10 digits, no alphabets)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(contactNumber)) {
    return res.status(400).json({ success: false, message: "Contact number must be exactly 10 digits." });
  }

  // 5. Validate Email Format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactEmail)) {
    return res.status(400).json({ success: false, message: "Please provide a valid email address." });
  }

  // 6. Description Check
  if (!description || description.length < 10) {
    return res.status(400).json({ success: false, message: "Please provide a detailed description (min 10 chars)." });
  }

  // If everything is okay, go to the next step (the Route)
  next();
};

module.exports = validateReport;