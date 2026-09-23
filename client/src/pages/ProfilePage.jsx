import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiShield, FiEdit2, FiSave } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    // API call to update profile
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl overflow-hidden relative"
      >
        <div className="h-32 bg-gradient-to-r from-primary/30 to-neon-purple/30 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-dark-300 rounded-2xl border-4 border-dark-400 flex items-center justify-center shadow-xl">
            <span className="text-4xl font-bold text-white">{user?.name?.charAt(0) || 'U'}</span>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
              <p className="text-primary font-mono text-sm capitalize">{user?.role?.replace('_', ' ') || 'Citizen'}</p>
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-white/10"
            >
              {isEditing ? <><FiSave /> Save</> : <><FiEdit2 /> Edit</>}
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FiUser /> Full Name
                </label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-dark-200 border border-white/20 text-white rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.name || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FiMail /> Email Address
                </label>
                <p className="text-gray-300 text-lg">{user?.email || 'email@example.com'}</p>
                <p className="text-xs text-primary">Verified</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FiPhone /> Phone Number
                </label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-dark-200 border border-white/20 text-white rounded-lg px-3 py-2"
                  />
                ) : (
                  <p className="text-white text-lg">{formData.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <FiShield /> Clearance ID
                </label>
                <p className="text-gray-300 font-mono text-lg">{user?._id || 'USR-7840-X'}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
