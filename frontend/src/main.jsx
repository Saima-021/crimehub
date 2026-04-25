import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // User Context
import { OfficerAuthProvider } from "./context/OfficerAuthContext"; // Officer Context
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <OfficerAuthProvider> 
        <App />
      </OfficerAuthProvider>
    </AuthProvider>
  </BrowserRouter>
);