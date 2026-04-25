import React, { useState } from 'react';
import axios from 'axios';

const OfficerManageOfficers = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    badgeNumber: '',
    role: 'OFFICER',
    assignedDepartment: 'Online Fraud' // Default based on your enum
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const departments = [
    "Online Fraud", "Identity Theft", "Cyber Harassment / Bullying",
    "Phishing / Scam", "Social Media Crime", "Financial Fraud",
    "Hacking / Account Takeover", "Fake Profile / Impersonation", "Other"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('officerToken'); // Retrieve token for auth if needed
      const response = await axios.post('http://localhost:5000/api/officer/create-officer', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Officer Registered Successfully!' });
        setFormData({ fullName: '', email: '', password: '', badgeNumber: '', role: 'OFFICER', assignedDepartment: 'Online Fraud' });
      }
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Error creating officer' });
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row mb-4">
        <div className="col-12 text-start">
          <h2 className="fw-bold" style={{ color: 'var(--text-main)' }}>Registration</h2>
          <p className="text-muted">Onboard officials into the CrimeHub Intelligence Unit.</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({type:'', text:''})}></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="white-page-content p-4 border-0" style={{ backgroundColor: 'var(--card-bg)' }}>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3 text-start">
                  <label className="form-label small fw-bold">FULL NAME</label>
                  <input type="text" name="fullName" value={formData.fullName} className="form-control bg-transparent text-reset" placeholder="Kathryn Murphy" onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3 text-start">
                  <label className="form-label small fw-bold">BADGE NUMBER</label>
                  <input type="text" name="badgeNumber" value={formData.badgeNumber} className="form-control bg-transparent text-reset" placeholder="CH-9921" onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3 text-start">
                <label className="form-label small fw-bold">OFFICIAL EMAIL</label>
                <input type="email" name="email" value={formData.email} className="form-control bg-transparent text-reset" placeholder="k.murphy@crimehub.gov" onChange={handleChange} required />
              </div>

              <div className="mb-3 text-start">
                <label className="form-label small fw-bold">PASSWORD</label>
                <input type="password" name="password" value={formData.password} className="form-control bg-transparent text-reset" placeholder="••••••••" onChange={handleChange} required />
              </div>

              <div className="row text-start">
                <div className="col-md-6 mb-3 text-start">
                  <label className="form-label small fw-bold">ASSIGN DEPARTMENT</label>
                  <select name="assignedDepartment" value={formData.assignedDepartment} className="form-select bg-transparent text-reset" onChange={handleChange}>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold">ASSIGN ROLE</label>
                  <select name="role" value={formData.role} className="form-select bg-transparent text-reset" onChange={handleChange}>
                    <option value="OFFICER">Standard Officer</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn w-100 mt-3 py-2 fw-bold" style={{ backgroundColor: '#007bff', color: 'white' }}>
                Register Official
              </button>
            </form>
          </div>
        </div>

        {/* PREVIEW CARD */}
        <div className="col-lg-5">
          <div className="selection-card p-5 h-100 d-flex flex-column align-items-center justify-content-center border-0 shadow-sm text-center">
            <div className="display-4 mb-3">🛡️</div>
            <h4 className="fw-bold mb-1">{formData.fullName || "New Official"}</h4>
            <p className="badge bg-primary mb-3">{formData.assignedDepartment}</p>
            <div className="w-100 d-flex justify-content-between px-4 mt-2">
              <small className="text-muted">Badge: <strong>{formData.badgeNumber || 'N/A'}</strong></small>
              <small className="text-muted">Role: <strong>{formData.role}</strong></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerManageOfficers;