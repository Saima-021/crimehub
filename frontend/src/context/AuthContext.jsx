import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // CRITICAL: Start as true
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            setUser(decoded);
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false); 
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post("/auth/login", { email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setUser(decoded);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ADDED: Special function for Officer Login to sync with Context
  const officerLoginSync = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null); // ✅ Clear old errors before starting
      
      const { data } = await API.post("/auth/register", userData);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        const decoded = jwtDecode(data.token);
        setUser(decoded);
      } else {
        setUser(data.user || data);
      }
    } catch (err) {
      // ✅ This extracts the .withMessage() from your backend validators
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage); 
      
      // Keep error for exactly 5 seconds then clear (optional but good UX)
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error, officerLoginSync }}>
      {children}
    </AuthContext.Provider>
  );
};