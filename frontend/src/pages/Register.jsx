import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { indiaStates } from "../data/indiaData";
import "../styles/home.css";

const Register = () => {
  const { register, loading, error, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    state: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [cities, setCities] = useState([]);
  const [localError, setLocalError] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  // --- REFINED: Real-time Validation Logic ---
  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) message = "Full name is required";
        else if (!/^[A-Za-z ]{3,50}$/.test(value)) message = "Full name must be 3-50 letters only";
        break;

      case "email":
        if (!value) message = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(value)) message = "Invalid email format";
        break;

      case "phone":
        if (!value) message = "Phone number is required";
        else if (!/^[0-9]{10,15}$/.test(value)) message = "Phone must be 10-15 digits";
        break;

      case "dateOfBirth":
        if (!value) {
          message = "Date of birth is required";
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (age < 18) message = "You must be at least 18 years old";
        }
        break;

      case "password":
        if (!value) message = "Password is required";
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value)) {
          message = "Include uppercase, lowercase, number and special character (min 8)";
        }
        break;

      case "confirmPassword":
        if (!value) message = "Please confirm your password";
        else if (value !== formData.password) message = "Passwords do not match";
        break;

      case "state":
        if (!value) message = "State selection is required";
        break;

      case "city":
        if (!value) message = "City selection is required";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    return message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setFormData((prev) => ({ ...prev, state: value, city: "" }));
      setCities(indiaStates[value] || []);
      validateField("state", value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // --- TRIGGER: Final on-the-spot validation for all fields ---
    const results = Object.keys(formData).map((key) => validateField(key, formData[key]));
    const hasErrors = results.some((msg) => msg !== "");

    if (hasErrors) {
      setLocalError("Please correct the errors before registering.");
      return;
    }

    await register({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dateOfBirth: formData.dateOfBirth,
      state: formData.state,
      city: formData.city,
      password: formData.password,
    });
  };

  return (
    <div className="home">
      <section className="hero-section d-flex align-items-center text-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card shadow-lg border-0 p-4">
                <h3 className="text-center mb-4 fw-bold text-dark">Create Your Account</h3>

                {localError && <div className="alert alert-danger py-2 small">{localError}</div>}
                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                {/* ADDED: noValidate to stop browser popups */}
                <form onSubmit={handleSubmit} className="row g-3" noValidate>
                  <div className="col-12 text-dark text-start">
                    <label className="form-label fw-bold small">Full Name</label>
                    <input
                      className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={(e) => validateField("fullName", e.target.value)}
                    />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                  </div>

                  <div className="col-md-6 text-dark text-start">
                    <label className="form-label fw-bold small">Email</label>
                    <input
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={(e) => validateField("email", e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>

                  <div className="col-md-6 text-dark text-start">
                    <label className="form-label fw-bold small">Phone</label>
                    <input
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={(e) => validateField("phone", e.target.value)}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>

                  <div className="col-12 text-dark text-start">
                    <label className="form-label fw-bold small">Date of Birth</label>
                    <input
                      className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""}`}
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onBlur={(e) => validateField("dateOfBirth", e.target.value)}
                    />
                    {errors.dateOfBirth && <div className="invalid-feedback">{errors.dateOfBirth}</div>}
                  </div>

                  <div className="col-md-6 text-dark text-start">
                    <label className="form-label fw-bold small">State</label>
                    <select
                      className={`form-select ${errors.state ? "is-invalid" : ""}`}
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      onBlur={(e) => validateField("state", e.target.value)}
                    >
                      <option value="">Select State</option>
                      {Object.keys(indiaStates).map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                  </div>

                  <div className="col-md-6 text-dark text-start">
                    <label className="form-label fw-bold small">City</label>
                    <select
                      className={`form-select ${errors.city ? "is-invalid" : ""}`}
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={(e) => validateField("city", e.target.value)}
                      disabled={!formData.state}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                  </div>

                  <div className="col-md-6 text-dark text-start">
                    <label className="form-label fw-bold small">Password</label>
                    <input
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={(e) => validateField("password", e.target.value)}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>

                  <div className="col-md-6 text-dark text-start">
                    <label className="form-label fw-bold small">Confirm Password</label>
                    <input
                      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={(e) => validateField("confirmPassword", e.target.value)}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>

                  <div className="col-12 mt-4">
                    <button className="btn btn-primary w-100 fw-bold py-2" type="submit" disabled={loading}>
                      {loading ? "Creating Account..." : "Register"}
                    </button>
                  </div>
                </form>

                <p className="text-center mt-3 text-dark small">
                  Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Login here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;