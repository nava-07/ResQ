import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiHeart, FiArrowLeft, FiTarget } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const VolunteerLogin = () => {
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
      await login({ ...formData, role: 'volunteer' });
      toast.success('Field Agent Clearance Verified');
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/15 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-teal-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Top back button */}
      <div className="w-full max-w-md mb-4 relative z-10 flex justify-between items-center">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
          <FiArrowLeft /> Back to Portal Hub
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
          FIELD AGENT PORTAL
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
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <FiHeart className="text-emerald-400 text-2xl" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-1">VOLUNTEER LOGIN</h2>
          <p className="text-gray-400 text-sm">Field Response & Disaster Relief Operations</p>
        </div>

        <div className="glass-strong p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.15)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Volunteer Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="text-emerald-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-200/60 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600 text-sm"
                  placeholder="volunteer@resq.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Clearance Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="text-emerald-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-dark-200/60 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-600 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-white text-dark-400 font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-dark-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>ENTER FIELD AGENT HUB</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
            <p className="text-sm text-gray-400">
              Join volunteer network? <Link to="/register?role=volunteer" className="text-emerald-400 font-medium hover:underline">Register as Volunteer</Link>
            </p>

            {/* Quick Switch Portals */}
            <div className="w-full flex items-center justify-center gap-2 pt-2 text-xs text-gray-500">
              <span>Other Portals:</span>
              <Link to="/login/citizen" className="text-primary hover:underline">Citizen</Link>
              <span>•</span>
              <Link to="/login/rescue" className="text-accent hover:underline">Rescue</Link>
              <span>•</span>
              <Link to="/login/admin" className="text-neon-purple hover:underline">Admin</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VolunteerLogin;
