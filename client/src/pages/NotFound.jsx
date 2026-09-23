import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-400 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glitch effect items */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
        <h1 className="text-[20rem] font-bold text-accent font-mono blur-sm">404</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center space-y-6"
      >
        <div className="relative inline-block">
          <h1 className="text-8xl font-bold text-white tracking-tighter mix-blend-difference relative z-10 animate-pulse">404</h1>
          <h1 className="text-8xl font-bold text-primary tracking-tighter absolute top-0 left-1 -z-10 mix-blend-screen">404</h1>
          <h1 className="text-8xl font-bold text-accent tracking-tighter absolute top-0 -left-1 -z-10 mix-blend-screen">404</h1>
        </div>

        <h2 className="text-2xl text-gray-300 font-mono tracking-widest uppercase">Mission Not Found</h2>
        
        <p className="text-gray-500 max-w-md mx-auto">
          The coordinates you entered do not exist in our database. The signal may have been lost or the sector is restricted.
        </p>

        <div className="pt-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 text-white rounded-full transition-all"
          >
            <FiHome /> Return to Base
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
