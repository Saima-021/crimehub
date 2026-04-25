import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { indiaStates } from "../../data/indiaData";

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    state: "",
    city: ""
  });

  const [reportCount, setReportCount] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    state: "",
    city: "",
    password: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserInfo({
          fullName: decoded.fullName,
          email: decoded.email,
          phone: decoded.phone,
          state: decoded.state,
          city: decoded.city
        });

        setFormData({
          fullName: decoded.fullName,
          phone: decoded.phone,
          state: decoded.state,
          city: decoded.city,
          password: ""
        });

        setCities(indiaStates[decoded.state] || []);

        fetch("http://localhost:5000/api/reports/my-reports", {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) setReportCount(data.data.length);
          });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const validateField = (name, value) => {
    let message = "";
    switch (name) {
      case "fullName":
        if (!/^[A-Za-z ]{3,50}$/.test(value)) {
          message = "Full name must be 3-50 letters only";
        }
        break;
      case "phone":
        if (!/^[0-9]{10,15}$/.test(value)) {
          message = "Phone must be 10-15 digits";
        }
        break;
      case "state":
        if (!value) message = "State is required";
        break;
      case "city":
        if (!value) message = "City is required";
        break;
      case "password":
        if (!value) {
          message = "Password required to confirm changes";
        }
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: message }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "state") {
      setFormData({ ...formData, state: value, city: "" });
      setCities(indiaStates[value] || []);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    validateField(name, value);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        }
      );
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("Profile updated successfully");
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="fw-bold mb-4">Profile</h2>

      <div className="row g-4">
        {/* PROFILE CARD */}
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 p-4 border-start border-primary border-4 h-100">
            <h6 className="text-muted small fw-bold">LOCALITY</h6>
            <h4 className="mt-2 mb-2">
              {userInfo.city}, {userInfo.state}
            </h4>
            <p className="small text-muted">
              <strong>Name:</strong> {userInfo.fullName}
            </p>
            <p className="small text-muted">
              <strong>Email:</strong> {userInfo.email}
            </p>
            <p className="small text-muted">
              <strong>Phone:</strong> {userInfo.phone}
            </p>
            <button
              className="btn btn-primary btn-sm mt-3"
              onClick={() => setShowEdit(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 p-4 h-100">
            <h6 className="text-muted small fw-bold">REPORTS FILED</h6>
            <h2 className="fw-bold">{reportCount}</h2>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="card shadow-sm p-4 mt-4">
          <h5 className="mb-3">Edit Profile</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input
                className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              {errors.fullName && (
                <div className="invalid-feedback">{errors.fullName}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="invalid-feedback">{errors.phone}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">State</label>
              <select
                className={`form-select ${errors.state ? "is-invalid" : ""}`}
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {Object.keys(indiaStates).map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <div className="invalid-feedback">{errors.state}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">City</label>
              <select
                className={`form-select ${errors.city ? "is-invalid" : ""}`}
                name="city"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="">Select City</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <div className="invalid-feedback">{errors.city}</div>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                name="password"
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button className="btn btn-primary me-2" onClick={handleUpdate}>
              Save Changes
            </button>
            <button className="btn btn-dark" onClick={() => setShowEdit(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;