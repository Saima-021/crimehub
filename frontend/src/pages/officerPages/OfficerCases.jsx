import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OfficerCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('officerToken');
      const res = await axios.post(
        "http://localhost:5000/api/officer/assigned-cases",
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCases(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching cases:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      const token = localStorage.getItem('officerToken');
      const res = await axios.post(
        "http://localhost:5000/api/officer/update-case",
        { 
          reportId: selectedCase._id, 
          newStatus: status, 
          remarks: remarks 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(`Case updated to ${status}`);
        setSelectedCase(null);
        setRemarks("");
        fetchCases();
      }
    } catch (err) {
      alert("Error updating case");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Under Investigation': return 'bg-info text-dark';
      case 'Action Required': return 'bg-danger';
      case 'Closed': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4 text-start">
        <div>
          <h2 className="fw-bold mb-1">Investigation Files</h2>
          <p className="text-muted">Manage assigned reports and evidence</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-dark text-muted">
              <tr>
                <th className="p-3 border-0">Victim Name</th>
                <th className="p-3 border-0">Platform</th>
                <th className="p-3 border-0">Date</th>
                <th className="p-3 border-0">Status</th>
                <th className="p-3 border-0 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-5">Loading...</td></tr>
              ) : cases.map((item) => (
                <tr key={item._id}>
                  <td className="p-3 fw-bold">{item.userName}</td>
                  <td className="p-3">{item.platform}</td>
                  <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`badge ${getStatusBadge(item.status)}`}>{item.status}</span>
                  </td>
                  <td className="p-3 text-center">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedCase(item)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedCase && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-container">

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h4 className="fw-bold m-0 text-primary">
                Case File: {selectedCase.userName}
              </h4>

              <button className="btn-close" onClick={() => setSelectedCase(null)}></button>
            </div>

            <div className="text-start">

              {/* CONTACT */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <span className="modal-label">Victim Contact Information</span>
                  <p><strong>Phone:</strong> {selectedCase.contactNumber}</p>
                  <p><strong>Email:</strong> {selectedCase.contactEmail}</p>
                </div>

                <div className="col-md-6">
                  {/* ✅ Metadata removed */}
                  <span className="modal-label">Incident Details</span>
                  <p><strong>Platform:</strong> {selectedCase.platform}</p>
                  <p><strong>Date:</strong> {new Date(selectedCase.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-4">
                <span className="modal-label">Incident Description</span>
                <div className="p-3 rounded border">
                  {selectedCase.description}
                </div>
              </div>

              {/* PROOF */}
              <div className="mb-4">
                <span className="modal-label">Proof Submitted</span>

                <div className="d-flex gap-3 mt-2 flex-wrap">

                  {/* Empty proof */}
                  {(!selectedCase.proof || selectedCase.proof.length === 0) && (
                    <p className="text-muted">No proof uploaded</p>
                  )}

                  {/* Images */}
                  {selectedCase.proof && selectedCase.proof.map((file, index) => {
                    const imageUrl = `http://localhost:5000/uploads/${file}`;

                    return (
                      <a key={index} href={imageUrl} target="_blank" rel="noreferrer">
                        <img
                          src={imageUrl}
                          alt="Proof"
                          className="evidence-img"
                          style={{
                            width: '180px',
                            height: '180px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: '1px solid #ccc'
                          }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/180?text=Error';
                          }}
                        />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* ACTION */}
              <textarea
                className="form-control mb-3"
                placeholder="Enter remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />

              <div className="d-flex gap-2">
                <button className="btn btn-primary w-100" onClick={() => handleUpdateStatus('Under Investigation')}>
                  Update
                </button>
                <button className="btn btn-dark w-100" onClick={() => handleUpdateStatus('Action Required')}>
                  Request Proof
                </button>
                <button className="btn btn-primary w-100" onClick={() => handleUpdateStatus('Closed')}>
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerCases;