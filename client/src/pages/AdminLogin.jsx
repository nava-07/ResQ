import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiCpu, FiArrowLeft, FiShield, FiKey } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ ...formData, role: 'admin' });
      toast.success('Omni-Level Administrator Clearance Verified');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-400 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neon-purple/15 rounded-full blur-[130px] animate-pulse-glow"></div>
        <div className="absolute top-10 left-1/3 w-96 h-96 bg-purple-900/15 rounded-full blur-[110px]"></div>
      </div>

      {/* Top back button */}
      <div className="w-full max-w-md mb-4 relative z-10 flex justify-between items-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-neon-purple transition-colors">
          <FiArrowLeft /> Back to Portal Hub
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-neon-purple/10 text-neon-purple border border-neon-purple/30 font-mono flex items-center gap-1.5">
          <FiKey size={12} />
          OMNI ACCESS
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 flex items-center justify-center border border-neon-purple/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <FiCpu className="text-neon-purple text-2xl" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-1">ADMINISTRATOR TERMINAL</h2>
          <p className="text-gray-400 text-sm">Global System Oversight & Personnel Management</p>
        </div>

        <div className="glass-strong p-8 rounded-3xl border border-neon-purple/30 relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.15)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-pink-500 to-neon-purple"></div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Master Administrator Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="text-neon-purple" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-200/60 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 text-sm"
                  placeholder="admin@resq.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Master Security Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="text-neon-purple" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-dark-200/60 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-600 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-purple hover:bg-white text-white hover:text-dark-400 font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>AUTHENTICATE OMNI ACCESS</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
            <p className="text-xs text-gray-400 text-center">
              Restricted system. Need clearance? <Link to="/register?role=admin" className="text-neon-purple hover:underline font-semibold">Register Admin Account</Link>
            </p>

            {/* Quick Switch Portals */}
            <div className="w-full flex items-center justify-center gap-2 pt-2 text-xs text-gray-500">
              <span>Other Portals:</span>
              <Link to="/login/citizen" className="text-primary hover:underline">Citizen</Link>
              <span>•</span>
              <Link to="/login/volunteer" className="text-emerald-400 hover:underline">Volunteer</Link>
              <span>•</span>
              <Link to="/login/rescue" className="text-accent hover:underline">Rescue</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
