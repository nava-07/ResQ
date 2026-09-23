import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiShield, FiHeart, FiCpu } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'citizen';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: initialRole
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    
    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role
      });
      toast.success(`Registered as ${formData.role.replace('_', ' ').toUpperCase()}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'citizen', label: 'Citizen', icon: FiUser, color: 'text-primary' },
    { id: 'volunteer', label: 'Volunteer', icon: FiHeart, color: 'text-emerald-400' },
    { id: 'rescue_team', label: 'Rescue Team', icon: FiShield, color: 'text-accent' },
    { id: 'admin', label: 'Admin', icon: FiCpu, color: 'text-neon-purple' }
  ];

  return (
    <div className="min-h-screen bg-dark-400 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">REGISTER PERSONNEL</h2>
          <p className="text-gray-400">Join the ResQ response network</p>
        </div>

        <div className="glass-strong p-8 rounded-2xl border border-primary/20 relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Select Clearance Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {roles.map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setFormData({...formData, role: r.id})}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                      formData.role === r.id 
                        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(0,212,255,0.2)]' 
                        : 'border-white/10 hover:border-white/30 bg-dark-200/50'
                    }`}
                  >
                    <r.icon size={20} className={`${r.color} mb-1.5`} />
                    <span className={`text-xs font-medium ${formData.role === r.id ? 'text-white' : 'text-gray-400'}`}>
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-xl pl-10 pr-3 py-2.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-xl pl-10 pr-3 py-2.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-200/50 border border-white/10 text-white rounded-xl pl-10 pr-3 py-2.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm"
                  placeholder="agent@resq.org"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-xl pl-10 pr-3 py-2.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase mb-1">Confirm</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-dark-200/50 border border-white/10 text-white rounded-xl pl-10 pr-3 py-2.5 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-white text-dark-400 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] flex items-center justify-center mt-6 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-dark-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                `CREATE ${formData.role.replace('_', ' ').toUpperCase()} CLEARANCE`
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already registered? <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">Login via Portal Hub</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
