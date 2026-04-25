import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyStatus = () => {
  const [reports, setReports] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({}); // Track files per report ID

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/reports/my-reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data.data);
    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

  const handleFileChange = (reportId, files) => {
    setSelectedFiles({ ...selectedFiles, [reportId]: files });
  };

  const handleUploadAdditionalProof = async (reportId) => {
    const files = selectedFiles[reportId];
    if (!files || files.length === 0) return alert("Please select files first");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('additionalProof', files[i]);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/reports/add-proof/${reportId}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      alert("Additional proof submitted! Status reset to Pending.");
      fetchReports(); // Refresh the list
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>My Report Status</h2>
      <div className="list-group">
        {reports.map(report => (
          <div key={report._id} className="list-group-item mb-3 shadow-sm border rounded">
            <div className="d-flex justify-content-between">
              <h5>{report.reportType}</h5>
              <span className={`badge ${
                report.status === 'Action Required' ? 'bg-dark' : 
                report.status === 'Pending' ? 'bg-primary text-dark' : 'bg-primary'
              }`}>
                {report.status}
              </span>
            </div>
            <p className="text-muted small">ID: {report._id}</p>
            <p>{report.description}</p>

            {/* If Officer left a message */}
            {report.remarks && (
              <div className="alert alert-info py-2 small">
                <strong>Officer Remark:</strong> {report.remarks}
              </div>
            )}

            {/* Show Upload only if Action Required */}
            {report.status === 'Action Required' && (
              <div className="mt-3 p-3 border-top">
                <label className="form-label fw-bold">Upload Requested Evidence:</label>
                <input 
                  type="file" 
                  multiple 
                  className="form-control mb-2" 
                  onChange={(e) => handleFileChange(report._id, e.target.files)}
                />
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleUploadAdditionalProof(report._id)}
                >
                  Submit Additional Proof
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyStatus;