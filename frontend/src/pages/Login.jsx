import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/home.css";

const Login = () => {
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData.email, formData.password);
    navigate("/dashboard");
  };

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center text-light">
        <div className="container">

          <div className="row justify-content-center">
            <div className="col-lg-5">

              <div className="card shadow-lg border-0 p-4">
                <h3 className="text-center mb-4 fw-bold">Login to CrimeHub</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100 fw-bold mt-2"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : "Login"}
                  </button>

                </form>

                <p className="text-center mt-3">
                  Don’t have an account?{" "}
                  <Link to="/register">Register</Link>
                  <br></br>
                  Don’t Password?{" "}
                  <Link to="/forgot-password">Forgot Password?</Link>
                </p>

              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Login;