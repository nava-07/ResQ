import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-dark-400 z-[100] flex flex-col items-center justify-center">
      <div className="relative w-24 h-24 mb-8">
        {/* Outer glowing ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full shadow-[0_0_30px_rgba(0,212,255,0.3)]"
        />
        {/* Inner pulsing ring */}
        <motion.div 
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-4 bg-primary/20 rounded-full blur-md"
        />
        {/* Center logo text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-primary font-bold text-2xl">D</span>
        </div>
      </div>
      
      <div className="font-mono text-primary text-sm tracking-widest overflow-hidden whitespace-nowrap border-r-2 border-primary pr-1 w-fit animate-[typing_2s_steps(24,end)_infinite,blink_1s_step-end_infinite]">
        INITIALIZING SYSTEM...
      </div>
      
      <style jsx>{`
        @keyframes typing {
          0% { width: 0 }
          50% { width: 220px }
          100% { width: 220px }
        }
        @keyframes blink {
          50% { border-color: transparent }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
