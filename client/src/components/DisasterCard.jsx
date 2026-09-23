import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiActivity } from 'react-icons/fi';

const DisasterCard = ({ disaster }) => {
  const { type, location, severity, status, createdAt, description } = disaster;

  const severityColors = {
    Low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const statusColors = {
    Pending: 'text-yellow-400',
    Active: 'text-red-400',
    Resolved: 'text-emerald-400'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass p-5 rounded-xl border border-white/10 hover:border-white/20 transition-all flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-white capitalize flex items-center gap-2">
          {type}
        </h3>
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${severityColors[severity] || severityColors.Low}`}>
          {severity}
        </span>
      </div>

      <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">
        {description || 'No description provided.'}
      </p>

      <div className="space-y-2 mt-auto">
        <div className="flex items-center text-xs text-gray-400 gap-2">
          <FiMapPin className="text-primary" />
          <span className="truncate">{location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <FiClock className="text-primary" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <FiActivity className={statusColors[status] || 'text-gray-400'} />
            <span className={statusColors[status] || 'text-gray-400'}>{status}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DisasterCard;
