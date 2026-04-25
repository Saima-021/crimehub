import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/home.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="home">

      <section className="hero-section d-flex align-items-center text-light">
        <div className="container">

          <div className="row justify-content-center">
            <div className="col-lg-5">

              <div className="card shadow-lg border-0 p-4">

                <h3 className="text-center mb-4 fw-bold">
                  Reset Your Password
                </h3>

                {message && (
                  <div className="alert alert-info">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">Registered Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-bold mt-2"
                  >
                    Send Reset Link
                  </button>

                </form>

                <p className="text-center mt-3">
                  Remember your password?{" "}
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

export default ForgotPassword;