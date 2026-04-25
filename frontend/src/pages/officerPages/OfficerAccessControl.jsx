import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OfficerAccessControl = () => {

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOfficer, setEditOfficer] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    badgeNumber: "",
    assignedDepartment: ""
  });

  const fetchStaff = async () => {
    try {

      const token = localStorage.getItem('officerToken');

      const res = await axios.post(
        'http://localhost:5000/api/officer/all-officers',
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {

        const regularOfficers =
          res.data.data.filter(user => user.role !== 'SUPER_ADMIN');

        setStaff(regularOfficers);

      }

    } catch (err) {

      console.error("Fetch Error:", err.response?.status, err.response?.data);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchStaff();

  }, []);



  // TOGGLE ACCESS (Suspend / Restore)
  const handleToggle = async (officerId) => {

    try {

      const token = localStorage.getItem('officerToken');

      const res = await axios.post(
        `http://localhost:5000/api/officer/toggle-status/${officerId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {

        setStaff(prevStaff =>
          prevStaff.map(member =>
            member._id === officerId
              ? { ...member, isActive: res.data.isActive }
              : member
          )
        );

      }

    } catch (err) {

      alert(err.response?.data?.message || "Failed to toggle status");

    }

  };



  // OPEN EDIT MODAL
  const openEdit = (officer) => {

    setEditOfficer(officer);

    setFormData({
      fullName: officer.fullName,
      email: officer.email,
      badgeNumber: officer.badgeNumber,
      assignedDepartment: officer.assignedDepartment
    });

  };



  // UPDATE OFFICER
  const handleUpdate = async () => {

    try {

      const token = localStorage.getItem("officerToken");

      const res = await axios.post(
        `http://localhost:5000/api/officer/update-officer/${editOfficer._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {

        fetchStaff();
        setEditOfficer(null);

      }

    } catch (err) {

      alert("Update failed");

    }

  };



  // DELETE OFFICER
  const handleDelete = async (officerId) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this officer?"
    );

    if (!confirmDelete) return;

    try {

      const token = localStorage.getItem("officerToken");

      const res = await axios.post(
        `http://localhost:5000/api/officer/delete-officer/${officerId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {

        fetchStaff();

      }

    } catch (err) {

      alert("Delete failed");

    }

  };



  if (loading)
    return (
      <div className="p-5 text-center text-white">
        Accessing Personnel Files...
      </div>
    );



  return (

    <div className="container-fluid p-0">

      <div className="mb-4 text-start">

        <h2 className="fw-bold" style={{ color: 'var(--text-main)' }}>
          Staff Access Control
        </h2>

        <p className="text-muted">
          Currently managing {staff.length} regular officers.
        </p>

      </div>



      <div className="row g-4">

        {staff.length === 0 ? (

          <div className="text-white text-center mt-5">
            No regular officers found in the system.
          </div>

        ) : (

          staff.map((member) => (

            <div className="col-md-4" key={member._id}>

              <div className="selection-card p-4 border-0 shadow-sm position-relative text-start">

                <span
                  className={`badge position-absolute top-0 end-0 m-3 ${member.isActive ? 'bg-dark' : 'bg-dark'}`}
                >
                  {member.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>


                <div className="mb-3 mt-2">

                  <h5 className="fw-bold mb-0">
                    {member.fullName}
                  </h5>

                  <small className="text-muted">
                    {member.assignedDepartment || "General"}
                  </small>

                </div>


                <div className="mt-4">

                  <div className="d-flex justify-content-between mb-3 text-white">

                    <div>
                      <p className="small mb-0 text-muted">BADGE ID</p>
                      <p className="fw-bold mb-0 text-dark">{member.badgeNumber}</p>
                    </div>

                    <div className="text-end">
                      <p className="small mb-0 text-muted">ROLE</p>
                      <p className="fw-bold mb-0 text-dark">
                        {member.role}
                      </p>
                    </div>

                  </div>



                  <div className="d-grid gap-2">

                    <button
                      className="btn btn-sm btn-outline-dark fw-bold"
                      onClick={() => openEdit(member)}
                    >
                      Edit Officer
                    </button>


                    <button
                      onClick={() => handleToggle(member._id)}
                      className={`btn btn-sm fw-bold ${
                        member.isActive
                          ? "btn-outline-primary"
                          : "btn-primary text-white"
                      }`}
                    >
                      {member.isActive
                        ? "Disable Access"
                        : "Restore Access"}
                    </button>


                    <button
                      onClick={() => handleDelete(member._id)}
                      className="btn btn-sm btn-outline-dark fw-bold"
                    >
                      Delete Officer
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))

        )}

      </div>



      {/* EDIT MODAL */}

      {editOfficer && (

        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >

          <div className="modal-dialog">

            <div className="modal-content p-4">

              <h5 className="fw-bold mb-3">Edit Officer</h5>

              <input
                className="form-control mb-2"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Full Name"
              />


              <input
                className="form-control mb-2"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
              />


              <input
                className="form-control mb-2"
                value={formData.badgeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, badgeNumber: e.target.value })
                }
                placeholder="Badge Number"
              />


              <select
                className="form-control mb-3"
                value={formData.assignedDepartment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    assignedDepartment: e.target.value
                  })
                }
              >

                <option>Online Fraud</option>
                <option>Identity Theft</option>
                <option>Cyber Harassment / Bullying</option>
                <option>Phishing / Scam</option>
                <option>Social Media Crime</option>
                <option>Financial Fraud</option>
                <option>Hacking / Account Takeover</option>
                <option>Fake Profile / Impersonation</option>
                <option>Other</option>

              </select>


              <div className="d-flex justify-content-end gap-2">

                <button
                  className="btn btn-secondary"
                  onClick={() => setEditOfficer(null)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleUpdate}
                >
                  Save Changes
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default OfficerAccessControl;