import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem('token');

  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (!allowedRoles) {
    return user ? children : <Navigate to="/login" replace />;
  }

  if (!token) {
    return <Navigate to="/officer/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/officer/login" replace />;
    }

    if (!allowedRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;

  } catch (error) {
    console.error("Auth Error:", error);
    return <Navigate to="/officer/login" replace />;
  }
};

export default ProtectedRoute;