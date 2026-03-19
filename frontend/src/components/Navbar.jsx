import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    // Sync state on mount
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);

    // Listen for storage changes (for multiple tab/window sync)
    const handleStorageChange = () => {
      setCurrentUser(AuthService.getCurrentUser());
    };

    // Listen for internal auth changes
    const handleAuthChange = () => {
      setCurrentUser(AuthService.getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigate('/auth');
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-700/80 backdrop-blur-md border-b border-blue-500/30 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-blue-700 font-extrabold text-xl">E</span>
          </div>
          <Link to="/" className="text-white text-2xl font-extrabold tracking-tight hover:text-blue-100 transition duration-300">
            EventManager
          </Link>
        </div>

        <div className="hidden md:flex gap-8 text-blue-50 font-medium">
          <Link to="/" className="hover:text-white transition-colors duration-300 font-semibold">Home</Link>
          <a href="#" className="hover:text-white transition-colors duration-300">Events</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Planning</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Services</a>
        </div>

        <div className="flex gap-4 items-center">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-blue-700 font-bold text-lg">{currentUser.user?.firstName?.charAt(0) || 'U'}</span>
                </div>
                <span className="text-white font-medium group-hover:text-blue-200 transition-colors hidden sm:inline">
                  {currentUser.user?.firstName || 'User'}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/30 px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-white text-blue-700 hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-lg px-6 py-2.5 rounded-full font-bold transition-all duration-300"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
