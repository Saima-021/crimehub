import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/home.css";

const ResetPassword = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error resetting password"
      );
    }
  };

  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center text-light">
        <div className="container">

          <div className="row justify-content-center">
            <div className="col-lg-5">

              <div className="card shadow-lg border-0 p-4">

                <h3 className="text-center mb-4 fw-bold">
                  Create New Password
                </h3>

                {message && (
                  <div className="alert alert-info">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-bold mt-2"
                  >
                    Reset Password
                  </button>

                </form>

                <p className="text-center mt-3">
                  Back to{" "}
                  <Link to="/login">Login</Link>
                </p>

              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ResetPassword;