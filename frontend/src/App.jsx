import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; 
import OfficerProtectedRoute from './components/OfficerProtectedRoute'; 
const OfficerOverview = lazy(() => import('./pages/officerPages/OfficerOverview.'));
const Layout = lazy(() => import('./layout/Layout')); 
const DashboardLayout = lazy(() => import('./layout/DashboardLayout')); 
const OfficerLayout = lazy(() => import('./layout/officer/OfficerLayout')); 
// --- PUBLIC PAGES ---
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Chatbot = lazy(() => import('./pages/Chatbot'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
// --- OFFICER PAGES ---
const OfficerLogin = lazy(() => import('./pages/officerPages/OfficerLogin'));

// NEW OFFICER PAGES
const OfficerManageOfficers = lazy(() => import('./pages/officerPages/OfficerManageOfficers'));
const OfficerAccessControl = lazy(() => import('./pages/officerPages/OfficerAccessControl'));
const OfficerSystemLogs =lazy(()=> import('./pages/officerPages/OfficerSystemLogs')) ;
const OfficerCases = lazy(() => import('./pages/officerPages/OfficerCases'));
const OfficerNewCases = lazy(() => import('./pages/officerPages/OfficerNewCases'));
const OfficerPending = lazy(() => import('./pages/officerPages/OfficerPending'));
const OfficeSolved = lazy(() => import('./pages/officerPages/OfficeSolved'));
// --- USER DASHBOARD PAGES ---
const Dashboard = lazy(() => import('./pages/userPages/Dashboard'));
const Report = lazy(() => import('./pages/userPages/Report'));
const Status = lazy(() => import('./pages/userPages/Status'));
const SpamDetection = lazy(() => import('./pages/userPages/SpamDetection'));

function App() {
  return (
    <Suspense fallback={<div className="p-5 text-center"><div className="spinner-border text-primary"></div><p>Loading CrimeHub...</p></div>}>
      <Routes>
        {/* PUBLIC & USER ROUTES (UNCHANGED) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatbot" element={<Chatbot />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} /> 
          <Route path="report" element={<Report />} />
          <Route path="status" element={<Status />} />
          <Route path="email-spam" element={<SpamDetection />} /> 
        </Route>

        {/* --- OFFICER PORTAL (UPDATED) --- */}
        <Route path="/officer/portal" element={<OfficerLogin />} />
        <Route 
          path="/officer" 
          element={
            <OfficerProtectedRoute>
              <OfficerLayout />
            </OfficerProtectedRoute>
          }
        >
          {/* Default view */}
          {/* New Management Pages */}
          <Route path="manage-officers" element={<OfficerManageOfficers />} />
          <Route path="access-control" element={<OfficerAccessControl />} />
          <Route path="cases" element={<OfficerCases />} />
          <Route path="system-logs" element={<OfficerSystemLogs/>} /> 
          <Route path="dashboard" element={<OfficerOverview />} />
          <Route path="new-cases" element={<OfficerNewCases />} />
          <Route path="pending-cases" element={<OfficerPending />} />
          <Route path="solved-cases" element={<OfficeSolved />} />
          {/* Catch-all for Officer */}
          <Route path="*" element={<Navigate to="/officer/dashboard" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;