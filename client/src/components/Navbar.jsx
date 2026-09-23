import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass-strong border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[rgb(var(--color-primary))]/20 flex items-center justify-center border border-[rgb(var(--color-primary))]/50 shadow-[0_0_15px_rgba(var(--color-primary),0.5)]">
              <span className="text-[rgb(var(--color-primary))] font-bold text-xl">R</span>
            </div>
            <span className="text-xl font-bold text-white tracking-wider">
              Res<span className="text-[rgb(var(--color-primary))]">Q</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link>
            <Link to="/dashboard/map" className="text-gray-300 hover:text-primary transition-colors">Map</Link>
            <Link to="/emergency-sos" className="text-accent font-bold hover:text-white flex items-center gap-1.5 transition-colors">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
              Emergency SOS
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center gap-2 bg-dark-200 px-3 py-1.5 rounded-full border border-white/10">
                  <FiUser className="text-primary" />
                  <span className="text-sm font-medium text-gray-200">{user.name || 'User'}</span>
                </div>
                <button 
                  onClick={logout}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-accent/20 hover:bg-accent/40 border border-accent/50 rounded-full transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 text-sm font-medium text-dark-400 bg-primary hover:bg-white hover:text-dark-400 rounded-full transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-b border-white/10 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary">Home</Link>
            <Link to="/dashboard/map" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary">Map</Link>
            <Link to="/emergency-sos" className="block px-3 py-2 text-base font-bold text-accent hover:text-white">🚨 Emergency SOS</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary">Dashboard</Link>
                <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-accent hover:bg-accent/10">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-primary">Login</Link>
                <Link to="/register" className="block px-3 py-2 text-base font-medium text-primary hover:text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
