import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiAlertTriangle, FiInfo, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const mockAlerts = [
  { id: 1, title: 'Tsunami Warning', message: 'Evacuate coastal areas immediately. High waves expected in 30 mins.', severity: 'critical', location: 'Coastal Region Zone A', time: '5 mins ago' },
  { id: 2, title: 'Power Outage', message: 'Main grid failure in Sector 7. Backup generators activated.', severity: 'warning', location: 'Sector 7', time: '1 hour ago' },
  { id: 3, title: 'Route Cleared', message: 'Highway 9 is now open for rescue vehicles.', severity: 'info', location: 'Highway 9', time: '2 hours ago' },
];

const AlertCenter = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [showForm, setShowForm] = useState(false);

  const severityStyles = {
    info: 'bg-blue-500/10 border-blue-500 text-blue-400',
    warning: 'bg-yellow-500/10 border-yellow-500 text-yellow-400',
    danger: 'bg-orange-500/10 border-orange-500 text-orange-400',
    critical: 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.2)]',
  };

  const handleCreate = (e) => {
    e.preventDefault();
    toast.success("Alert broadcasted across the network.");
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FiBell className="text-primary" /> Alert Center
          </h1>
          <p className="text-gray-400 mt-1">System-wide broadcast notifications and warnings.</p>
        </div>
        
        {isAdmin && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
          >
            <FiPlus /> Broadcast Alert
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-2xl border-primary/30">
          <h3 className="text-lg font-bold text-white mb-4">Create New Broadcast</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title</label>
                <input type="text" required className="w-full bg-dark-300 border border-white/10 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Severity</label>
                <select className="w-full bg-dark-300 border border-white/10 rounded-lg px-3 py-2 text-white">
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="danger">Danger</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Message</label>
              <textarea required rows="2" className="w-full bg-dark-300 border border-white/10 rounded-lg px-3 py-2 text-white resize-none"></textarea>
            </div>
            <button type="submit" className="bg-primary text-dark-400 font-bold px-6 py-2 rounded-lg">Send Broadcast</button>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {mockAlerts.map((alert, i) => (
          <motion.div 
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass p-5 rounded-2xl border-l-4 flex gap-4 ${severityStyles[alert.severity]}`}
          >
            <div className="pt-1">
              {alert.severity === 'info' ? <FiInfo size={24} /> : <FiAlertTriangle size={24} className={alert.severity === 'critical' ? 'animate-pulse' : ''} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-white text-lg">{alert.title}</h4>
                <span className="text-xs text-gray-500 font-mono">{alert.time}</span>
              </div>
              <p className="text-gray-300 text-sm mb-2">{alert.message}</p>
              <span className="text-xs font-mono bg-dark-300/50 px-2 py-1 rounded text-gray-400 border border-white/5">
                Target: {alert.location}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AlertCenter;
