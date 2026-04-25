import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function Report() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [reportType, setReportType] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [proofFiles, setProofFiles] = useState([]);

  // --- ADDED: Validation State ---
  const [errors, setErrors] = useState({});

  // --- ADDED: Professional Validation Logic ---
  const validateField = (name, value) => {
    let error = "";
    const now = new Date();

    if (name === "incidentDate") {
      if (!value) error = "Incident date is required.";
      else if (new Date(value) > now) error = "Date cannot be in the future.";
    }

    if (name === "incidentTime") {
      if (!value) {
        error = "Incident time is required.";
      } else if (incidentDate) {
        const selectedDateTime = new Date(`${incidentDate}T${value}`);
        // Adding a 1-minute buffer to prevent false "future" triggers due to sync delays
        if (selectedDateTime > new Date(now.getTime() + 60000)) {
          error = "Incident time cannot be in the future.";
        }
      }
    }

    if (name === "platform") {
      if (!value.trim()) {
        error = "Platform name is required.";
      } else if (!/^[A-Za-z\s]+$/.test(value)) {
        error = "Platform name must contain only alphabets.";
      }
    }

    if (name === "description") {
      if (!value.trim()) error = "Description is required.";
      else if (value.length < 10) error = "Description must be at least 10 characters.";
    }

    if (name === "proof") {
      if (value.length === 0) error = "At least one proof file is required.";
    }

    if (name === "contactNumber") {
      if (!value) error = "Contact number is required.";
      else if (!/^\d{10}$/.test(value)) error = "Contact number must be exactly 10 digits.";
    }

    if (name === "contactEmail") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Please enter a valid email address.";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  // Optional: keep decoding if you need user info elsewhere
  const [userData, setUserData] = useState({ id: "", name: "" });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData({
          id: decoded.id,
          name: decoded.fullName || decoded.name
        });
      } catch (err) {
        console.error("Token decode error", err);
      }
    }
  }, []);

  const crimeTypes = [
    "Online Fraud",
    "Identity Theft",
    "Cyber Harassment / Bullying",
    "Phishing / Scam",
    "Social Media Crime",
    "Financial Fraud",
    "Hacking / Account Takeover",
    "Fake Profile / Impersonation",
    "Other"
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      alert("You can only upload up to 5 images.");
      e.target.value = "";
    } else {
      setProofFiles(selectedFiles);
      validateField("proof", selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const e1 = validateField("incidentDate", incidentDate);
    const e2 = validateField("incidentTime", incidentTime);
    const e3 = validateField("platform", platform);
    const e4 = validateField("description", description);
    const e5 = validateField("proof", proofFiles);
    const e6 = validateField("contactNumber", contactNumber);
    const e7 = validateField("contactEmail", contactEmail);

    if (e1 || e2 || e3 || e4 || e5 || e6 || e7) {
      return; 
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("reportType", reportType);
    formData.append("incidentDate", incidentDate);
    formData.append("incidentTime", incidentTime);
    formData.append("description", description);
    formData.append("platform", platform);
    formData.append("contactNumber", contactNumber);
    formData.append("contactEmail", contactEmail);

    proofFiles.forEach((file) => {
      formData.append("proof", file);
    });

    try {
      const response = await fetch("http://localhost:5000/api/reports/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Success: " + result.message);
        setStep(1);
        setReportType("");
        setIncidentDate("");
        setIncidentTime("");
        setDescription("");
        setPlatform("");
        setContactNumber("");
        setContactEmail("");
        setProofFiles([]);
        setErrors({});
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Could not connect to server. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      {step === 1 ? (
        <div className="selection-view">
          <h4 className="mb-4 fw-bold">Select Incident Category</h4>
          <div className="row g-3">
            {crimeTypes.map((type) => (
              <div className="col-md-4" key={type}>
                <div
                  className="card p-4 text-center selection-card border-0 shadow-sm"
                  style={{ cursor: 'pointer', transition: '0.3s' }}
                  onClick={() => { setReportType(type); setStep(2); }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#057aef'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                >
                  <h6 className="m-0 fw-bold">{type}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="form-view">
          <button
            className="btn btn-link text-decoration-none p-0 mb-3"
            onClick={() => setStep(1)}
          >
            ← Back to Categories
          </button>

          <h4 className="fw-bold mb-4">
            Reporting: <span className="text-primary">{reportType}</span>
          </h4>

          <form onSubmit={handleSubmit} className="row g-3 bg-white p-3 rounded shadow-sm" noValidate>
            <div className="col-md-6">
              <label className="form-label small fw-bold">Incident Date</label>
              <input
                type="date"
                className={`form-control ${errors.incidentDate ? 'is-invalid' : ''}`}
                max={new Date().toISOString().split("T")[0]}
                value={incidentDate}
                onChange={(e) => { setIncidentDate(e.target.value); validateField("incidentDate", e.target.value); }}
                onBlur={(e) => validateField("incidentDate", e.target.value)}
              />
              {errors.incidentDate && <div className="text-danger small mt-1">{errors.incidentDate}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Incident Time</label>
              <input
                type="time"
                className={`form-control ${errors.incidentTime ? 'is-invalid' : ''}`}
                value={incidentTime}
                onChange={(e) => { setIncidentTime(e.target.value); validateField("incidentTime", e.target.value); }}
                onBlur={(e) => validateField("incidentTime", e.target.value)}
              />
              {errors.incidentTime && <div className="text-danger small mt-1">{errors.incidentTime}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-bold">
                Platform (e.g. Instagram, WhatsApp, Bank Name)
              </label>
              <input
                type="text"
                className={`form-control ${errors.platform ? 'is-invalid' : ''}`}
                placeholder="Where did the incident occur?"
                value={platform}
                onChange={(e) => { 
                  const val = e.target.value.replace(/[^A-Za-z\s]/g, ''); // Enforce alphabets only
                  setPlatform(val); 
                  validateField("platform", val); 
                }}
                onBlur={(e) => validateField("platform", e.target.value)}
              />
              {errors.platform && <div className="text-danger small mt-1">{errors.platform}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-bold">Detailed Description</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                rows="4"
                placeholder="Minimum 10 characters required..."
                value={description}
                onChange={(e) => { setDescription(e.target.value); validateField("description", e.target.value); }}
                onBlur={(e) => validateField("description", e.target.value)}
              ></textarea>
              {errors.description && <div className="text-danger small mt-1">{errors.description}</div>}
            </div>

            <div className="col-md-12">
              <label className="form-label small fw-bold">
                Upload Proof (Images only, Max 5)
              </label>
              <input
                type="file"
                className={`form-control ${errors.proof ? 'is-invalid' : ''}`}
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              {errors.proof && <div className="text-danger small mt-1">{errors.proof}</div>}
              <small className="text-muted">JPG or PNG only. Max 5MB per file.</small>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Your Contact Number</label>
              <input
                type="tel"
                inputMode="numeric"
                className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                placeholder="10-digit mobile number"
                value={contactNumber}
                onChange={(e) => { 
                    const val = e.target.value.replace(/\D/g, ''); 
                    setContactNumber(val); 
                    validateField("contactNumber", val); 
                }}
                onBlur={(e) => validateField("contactNumber", e.target.value)}
              />
              {errors.contactNumber && <div className="text-danger small mt-1">{errors.contactNumber}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold">Your Contact Email</label>
              <input
                type="email"
                className={`form-control ${errors.contactEmail ? 'is-invalid' : ''}`}
                placeholder="For official correspondence"
                value={contactEmail}
                onChange={(e) => { setContactEmail(e.target.value); validateField("contactEmail", e.target.value); }}
                onBlur={(e) => validateField("contactEmail", e.target.value)}
              />
              {errors.contactEmail && <div className="text-danger small mt-1">{errors.contactEmail}</div>}
            </div>

            <div className="col-12 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 py-2 fw-bold"
              >
                {loading ? "Processing..." : "Submit Official Report"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Report;