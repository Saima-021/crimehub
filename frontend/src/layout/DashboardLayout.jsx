import React, { useEffect, useState, Suspense } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'; // Added Link
import { jwtDecode } from 'jwt-decode';
import '../styles/DashboardLayout.css';
import Chatbot from '../pages/Chatbot';
const DashboardLayout = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.fullName || 'User');
      } catch (error) {
        console.error("Token decode error:", error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar-fixed">
        <div className="brand-area"><h3>CRIMEHUB</h3></div>
        <nav className="menu-links">
          <NavLink to="/dashboard" end className="menu-item">Home</NavLink>
          <NavLink to="/dashboard/report" className="menu-item">Report Crime</NavLink>
          <NavLink to="/dashboard/status" className="menu-item">My Status</NavLink>
          <NavLink to="/dashboard/email-spam" className="menu-item">Spam Detection </NavLink>
        </nav>
        <button onClick={handleLogout} className="logout-button-blue">Logout</button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-area">
        <header className="top-nav-fixed">
          <div className="welcome-section px-4 text-end">
            <span className="welcome-text">
              Welcome, <strong style={{ color: '#007bff' }}>{userName?.toUpperCase()}</strong>
            </span>
          </div>
        </header>

        <main className="content-scroller">
          <div className="white-page-content shadow-sm">
            <Suspense fallback={<div className="p-4">Loading Page...</div>}>
              <Outlet /> 
            </Suspense>
          </div>

          {/* --- ADD THIS: THE AI FLOATING BUTTON --- */}
          <Chatbot/>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;