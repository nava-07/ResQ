import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const AlertBanner = ({ alert, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (alert) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) onDismiss();
    }, 300); // Wait for exit animation
  };

  if (!alert) return null;

  const severityStyles = {
    info: 'bg-blue-900/80 border-blue-500 text-blue-100',
    warning: 'bg-yellow-900/80 border-yellow-500 text-yellow-100',
    danger: 'bg-orange-900/80 border-orange-500 text-orange-100',
    critical: 'bg-red-900/90 border-red-500 text-white shadow-[0_0_20px_rgba(255,0,0,0.4)]',
  };

  const Icon = alert.severity === 'info' ? FiInfo : FiAlertTriangle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className={`fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-40 p-4 rounded-lg border-l-4 backdrop-blur-md flex items-start gap-4 ${severityStyles[alert.severity || 'info']}`}
        >
          <div className="pt-1">
            <Icon size={24} className={alert.severity === 'critical' ? 'animate-pulse' : ''} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg mb-1">{alert.title}</h4>
            <p className="text-sm opacity-90">{alert.message}</p>
            {alert.location && (
              <p className="text-xs mt-2 opacity-75 font-mono">Location: {alert.location}</p>
            )}
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <FiX size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertBanner;
