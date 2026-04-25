import React, { useContext, Suspense, useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { OfficerAuthContext } from '../../context/OfficerAuthContext';
import '../../styles/GlobalTheme.css'; 

const OfficerLayout = () => {
  const { officer, officerLogout } = useContext(OfficerAuthContext);
  const navigate = useNavigate();
  
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('officer-theme') || 'black');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('officer-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'black' ? 'white' : 'black');

  const handleLogout = () => {
  // Clear all role tokens to prevent switching via URL
  localStorage.removeItem('officerToken');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('userData');
  
  // Force a hard reload to the login page to clear React state
  window.location.href = "/officer/login";
};

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar-fixed">
        <div className="brand-area"><h3>CRIMEHUB</h3></div>
        <nav className="menu-links">

    <NavLink to="/officer/dashboard" end className="menu-item">
    <i className="bi bi-speedometer2 me-2"></i> Profile
    </NavLink>

       {officer?.role === 'OFFICER' && (
  <>
    <div className="sidebar-label">CASES</div>

    <NavLink to="/officer/new-cases" className="menu-item">
      <i className="bi bi-folder-plus me-2"></i> New Cases
    </NavLink>

    <NavLink to="/officer/pending-cases" className="menu-item">
      <i className="bi bi-hourglass-split me-2"></i> Pending Cases
    </NavLink>

    <NavLink to="/officer/solved-cases" className="menu-item">
      <i className="bi bi-check-circle me-2"></i> Solved Cases
    </NavLink>
  </>
)}

          {officer?.role === 'SUPER_ADMIN' && (
            <>
              <div className="sidebar-label">MANAGEMENT</div>

<NavLink to="/officer/manage-officers" className="menu-item">
Manage Officers
</NavLink>
{/* ✅ NEW PAGE ADDED */}
<NavLink to="/officer/access-control" className="menu-item">
Officer Access Control
</NavLink>

              <NavLink to="/officer/system-logs" className="menu-item">
System Logs
</NavLink>
            </>
          )}

        </nav>  

       
         
        <button onClick={handleLogout} className="logout-button-blue">
Logout
</button>

      </aside>

      {/* MAIN CONTENT */}
      <div className="main-area">
        <header className="top-nav-fixed">
          <div className="d-flex align-items-center px-4 w-100 justify-content-between">
            <div className="welcome-section text-end">
              <span className="welcome-text">
                Welcome, <strong>{officer?.fullName?.toUpperCase()}</strong>
                <span className="badge ms-2">{officer?.role}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="content-scroller">
          <div className="themed-page-content">
            <Suspense fallback={<div className="p-4">Loading Portal...</div>}>
              <Outlet /> 
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerLayout;