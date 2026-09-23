import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, trend, colorClass = "text-primary" }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass p-6 rounded-2xl relative overflow-hidden group border border-white/5 hover:border-primary/30 transition-colors"
    >
      {/* Background glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          
          {trend && (
            <div className="mt-2 flex items-center text-xs">
              <span className={`px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-accent/10 text-accent'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              <span className="text-gray-500 ml-2">vs last week</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-dark-300/80 border border-white/5 ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
