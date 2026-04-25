import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OfficerAuthContext } from '../../context/OfficerAuthContext';
import axios from 'axios';

const OfficerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { officerLoginSync } = useContext(OfficerAuthContext);
  const navigate = useNavigate();

  // ✅ SESSION GUARD: If token exists, redirect to dashboard immediately
  useEffect(() => {
    const token = localStorage.getItem('officerToken');
    if (token) {
      navigate('/officer/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/officer/login', formData);
      
      if (res.data.success) {
        // Sync token and officer data to context/localStorage
        officerLoginSync(res.data.token, res.data.officer);
        navigate('/officer/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Official Portal</h3>
          <p className="text-muted small">Authorized Personnel Only</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Official Email</label>
            <input type="email" name="email" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" name="password" className="form-control" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-dark w-100 fw-bold" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify & Enter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfficerLogin;