import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { OfficerAuthContext } from '../context/OfficerAuthContext';

const OfficerProtectedRoute = ({ children, allowedRoles }) => {
  const { officer, loading } = useContext(OfficerAuthContext);

  // 1. Handle the loading state so the app doesn't flicker or redirect too early
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">Authenticating Badge...</span>
      </div>
    );
  }

  // 2. If no officer is logged in, redirect to the official login portal
  if (!officer) {
    return <Navigate to="/officer/portal" replace />;
  }

  // 3. If roles are specified (e.g., ['SUPER_ADMIN']) and the officer doesn't match, 
  // send them back to the standard officer dashboard
  if (allowedRoles && !allowedRoles.includes(officer.role)) {
    return <Navigate to="/officer/dashboard" replace />;
  }

  // 4. If all checks pass, render the requested page
  return children;
};

export default OfficerProtectedRoute;