import React from 'react';

const Navbar = ({ onSignIn }) => {
  return (
    <nav className="sticky top-0 z-50 bg-blue-700/80 backdrop-blur-md border-b border-blue-500/30 px-6 py-4 shadow-xl">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-blue-700 font-extrabold text-xl">E</span>
          </div>
          <a href="/" className="text-white text-2xl font-extrabold tracking-tight hover:text-blue-100 transition duration-300">
            EventManager
          </a>
        </div>

        <div className="hidden md:flex gap-8 text-blue-50 font-medium">
          <a href="#" className="hover:text-white transition-colors duration-300">Events</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Planning</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Services</a>
          <a href="#" className="hover:text-white transition-colors duration-300">Pricing</a>
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={onSignIn}
            className="text-blue-50 hover:text-white font-semibold transition duration-300"
          >
            Sign In
          </button>
          <button
            onClick={onSignIn}
            className="bg-white text-blue-700 hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-lg px-6 py-2.5 rounded-full font-bold transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
