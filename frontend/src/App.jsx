import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import UserDashboard from './components/UserDashboard';
import VerificationPending from './components/VerificationPending';
import VerificationSuccess from './components/VerificationSuccess';
import AuthService from './services/authService';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = AuthService.getCurrentUser();
  
  if (!user) {
    // Not logged in - redirect to auth
    return <Navigate to="/auth" />;
  }
  
  // Check if email is verified (if your user object has this info)
  // You might need to add this to your user object in localStorage
  if (user.user && !user.user.isVerified) {
    // Logged in but not verified - redirect to verification pending
    return <Navigate to="/verification-pending" state={{ email: user.user.email }} />;
  }
  
  // All good - show the protected component
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Verification Routes */}
        <Route path="/verification-pending" element={<VerificationPending />} />
        <Route path="/verify-email/:token" element={<VerificationSuccess />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;