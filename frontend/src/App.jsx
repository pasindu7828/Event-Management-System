import React, { useState } from 'react';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import './App.css';

function App() {
  const [view, setView] = useState('home');

  return (
    <div>
      {view === 'home' ? (
        <div className="relative">
          <HomePage onSignIn={() => setView('auth')} />
          <div className="fixed bottom-10 right-10 z-[9999]">
            <button
              onClick={() => setView('auth')}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
            >
              Demo Login Page
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <AuthPage onHome={() => setView('home')} />
        </div>
      )}
    </div>
  );
}

export default App;
