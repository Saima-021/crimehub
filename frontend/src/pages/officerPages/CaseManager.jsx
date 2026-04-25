import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaseManager = ({ filterStatuses, title }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [remarks, setRemarks] = useState("");

  const isClosedPage = filterStatuses.includes('Closed');

  useEffect(() => {
    fetchCases();
  }, [filterStatuses]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('officerToken');
      const res = await axios.post("http://localhost:5000/api/officer/assigned-cases", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const filtered = res.data.data.filter(c => filterStatuses.includes(c.status));
        setCases(filtered);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('officerToken');
      const res = await axios.post("http://localhost:5000/api/officer/update-case", 
        { reportId: selectedCase._id, newStatus, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSelectedCase(null);
        setRemarks("");
        fetchCases();
      }
    } catch (err) {
      alert("Status update failed");
    }
  };
  
  return (
    <div className="container-fluid p-0 text-start">
      <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>{title}</h2>
      <p className="text-muted mb-4">Official investigation records for {title.toLowerCase()}</p>

      {/* TABLE */}
      <div className="card shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <tr>
                <th className="p-3 border-0">Victim Name</th>
                <th className="p-3 border-0">Platform</th>
                <th className="p-3 border-0">Date Reported</th>
                <th className="p-3 border-0">Status</th>
                <th className="p-3 border-0 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center p-5">Loading digital files...</td></tr>
              ) : cases.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-5 text-muted">No records found.</td></tr>
              ) : (
                cases.map((item) => (
                  <tr key={item._id}>
                    <td className="p-3 fw-bold">{item.userName}</td>
                    <td className="p-3">{item.platform}</td>
                    <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`badge ${
                        item.status === 'Closed' ? 'bg-dark' : 
                        item.status === 'Pending' ? 'bg-dark text-white' : 
                        'bg-dark text-white'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button className="btn btn-sm btn-outline-primary px-3" onClick={() => setSelectedCase(item)}>
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {selectedCase && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-container">

            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h4 className="fw-bold m-0" style={{ color: '#3399ff' }}>
                Case File: {selectedCase.userName}
              </h4>
              <button className="btn-close" onClick={() => setSelectedCase(null)}></button>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <span className="modal-label">Victim Contact</span>
                <p><strong>Phone:</strong> {selectedCase.contactNumber}</p>
                <p><strong>Email:</strong> {selectedCase.contactEmail}</p>
              </div>

              <div className="col-md-6">
                {/* ✅ Metadata removed */}
                <span className="modal-label">Incident Details</span>
                <p><strong>Platform:</strong> {selectedCase.platform}</p>
                <p><strong>Status:</strong> {selectedCase.status}</p>
              </div>
            </div>

            {/* ✅ PROOF SECTION */}
            <div className="mb-4">
              <span className="modal-label">Proof Submitted</span>

              <div className="d-flex gap-3 mt-2 flex-wrap">

                {(!selectedCase.proof || selectedCase.proof.length === 0) && (
                  <p className="text-muted">No proof uploaded</p>
                )}

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
                          border: '1px solid #ccc',
                          cursor: 'pointer'
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
            <div className="work-area-box mt-4">
              <span className="modal-label">
                {selectedCase.status === 'Pending' ? "Initial Case Assessment" : "Investigation Action"}
              </span>

              <textarea 
                className="remarks-textarea"
                placeholder={selectedCase.status === 'Pending' ? "Enter opening remarks..." : "Enter updates..."}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />

              <div className="d-flex gap-2 mt-3">
                {selectedCase.status === 'Pending' ? (
                  <button className="btn btn-primary flex-grow-1" onClick={() => handleUpdateStatus('Under Investigation')}>
                    Open Case
                  </button>
                ) : isClosedPage ? (
                  <button className="btn btn-primary flex-grow-1" onClick={() => handleUpdateStatus('Under Investigation')}>
                    Reopen Case
                  </button>
                ) : (
                  <>
                    <button className="btn btn-primary flex-grow-1" onClick={() => handleUpdateStatus('Under Investigation')}>
                      Update
                    </button>
                    <button className="btn btn-primary flex-grow-1" onClick={() => handleUpdateStatus('Action Required')}>
                      Request Proof
                    </button>
                    <button className="btn btn-primary flex-grow-1" onClick={() => handleUpdateStatus('Closed')}>
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManager;