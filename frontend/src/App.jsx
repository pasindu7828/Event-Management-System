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
import UserProfile from './components/UserProfile';
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
  
  // All good - show the protected component
  return children;
};

function App() {
  const [user, setUser] = React.useState(AuthService.getCurrentUser());

  // Listen for auth changes globally
  React.useEffect(() => {
    const handleAuthChange = () => {
      setUser(AuthService.getCurrentUser());
    };
    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
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