import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const OfficerAuthContext = createContext();

export const OfficerAuthProvider = ({ children }) => {
  const [officer, setOfficer] = useState(() => {
    try {
      const savedOfficer = localStorage.getItem("officerData");
      const token = localStorage.getItem("officerToken");
      // Use the full object if available, otherwise null
      return (savedOfficer && token) ? JSON.parse(savedOfficer) : null;
    } catch (error) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("officerTheme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    const token = localStorage.getItem("officerToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // FIX: Only logout if token is expired. 
        // DO NOT use setOfficer(decoded) here because it deletes fullName and badgeNumber.
        if (decoded.exp * 1000 < Date.now()) {
          officerLogout();
        }
      } catch (err) {
        officerLogout();
      }
    }
    setLoading(false);
  }, [theme]);

  const toggleOfficerTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("officerTheme", newTheme);
  };

  // ✅ FIXED: Takes two arguments to ensure full data is saved
  const officerLoginSync = (token, officerData) => {
    localStorage.setItem("officerToken", token);
    localStorage.setItem("officerData", JSON.stringify(officerData));
    setOfficer(officerData);
  };

  const officerLogout = () => {
    localStorage.removeItem("officerToken");
    localStorage.removeItem("officerData");
    setOfficer(null);
  };

  return (
    <OfficerAuthContext.Provider 
      value={{ 
        officer, 
        loading, 
        officerLoginSync, 
        officerLogout,
        theme,
        toggleOfficerTheme 
      }}
    >
      {children}
    </OfficerAuthContext.Provider>
  );
};