import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheck, FiNavigation } from 'react-icons/fi';
import { detectCurrentLocation } from '../utils/location';

const SOSButton = ({ onSOS }) => {
  const [status, setStatus] = useState('idle'); // idle, loading, success
  const [statusText, setStatusText] = useState('HOLD TO ACTIVATE');

  const handleClick = async () => {
    if (status !== 'idle') return;
    
    setStatus('loading');
    setStatusText('LOCKING GPS...');
    try {
      // Auto-detect real location
      const loc = await detectCurrentLocation();
      setStatusText('BROADCASTING...');
      
      if (onSOS) {
        await onSOS(loc);
      }
      
      setStatus('success');
      setStatusText('DISPATCHED');
      setTimeout(() => {
        setStatus('idle');
        setStatusText('HOLD TO ACTIVATE');
      }, 4000);
    } catch (err) {
      console.error("SOS trigger error", err);
      setStatus('idle');
      setStatusText('HOLD TO ACTIVATE');
    }
  };

  return (
    <div className="relative flex items-center justify-center py-10">
      {/* Concentric pulse rings */}
      {status === 'idle' && (
        <>
          <div className="absolute w-44 h-44 bg-accent/25 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute w-56 h-56 bg-accent/15 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        </>
      )}

      <motion.button
        whileHover={{ scale: status === 'idle' ? 1.05 : 1 }}
        whileTap={{ scale: status === 'idle' ? 0.95 : 1 }}
        onClick={handleClick}
        className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 shadow-[0_0_50px_rgba(255,59,59,0.5)] transition-colors duration-500 cursor-pointer
          ${status === 'idle' ? 'bg-gradient-to-b from-accent to-red-800 border-red-400 hover:from-red-500 hover:to-red-900' : ''}
          ${status === 'loading' ? 'bg-dark-200 border-primary shadow-[0_0_40px_rgba(0,212,255,0.4)]' : ''}
          ${status === 'success' ? 'bg-emerald-600 border-emerald-400 shadow-[0_0_50px_rgba(34,197,94,0.6)]' : ''}
        `}
      >
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <FiAlertCircle size={48} className="text-white mb-2 animate-bounce" />
              <span className="text-3xl font-black text-white tracking-widest">SOS</span>
              <span className="text-[10px] text-red-200 mt-1 uppercase tracking-widest font-mono opacity-90">Auto-GPS Beacon</span>
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
              <span className="text-primary font-mono text-xs font-bold tracking-wider animate-pulse">{statusText}</span>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <FiCheck size={52} className="text-white mb-2" />
              <span className="text-white font-bold tracking-wider font-mono text-sm">BEACON ACTIVE</span>
              <span className="text-xs text-emerald-200 mt-0.5">Units En Route</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default SOSButton;
