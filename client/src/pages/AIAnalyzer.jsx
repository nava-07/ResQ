import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiAlertCircle, FiUsers, FiPackage, FiShield } from 'react-icons/fi';
import CountUp from 'react-countup';

const AIAnalyzer = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setResult(null);

    // Simulate AI processing
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: 87,
        level: 'Critical',
        affected: 4500,
        resources: ['Medical Kits x500', 'Clean Water x2000L', 'Helicopter Evac', 'Food Packets x1000'],
        instructions: [
          'Immediate evacuation of Sector 4 and 5.',
          'Dispatch 3 aerial rescue units.',
          'Setup medical camp at North Ridge.',
          'Broadcast emergency alerts to all mobile devices in 10km radius.'
        ]
      });
    }, 2500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <FiCpu className="text-primary" /> AI Core
          </h1>
          <p className="text-gray-400 text-sm">Input raw disaster parameters for real-time predictive analysis.</p>
        </div>

        <motion.div className="glass p-6 rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5"></div>
          <form onSubmit={handleAnalyze} className="relative z-10 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Disaster Classification</label>
              <select className="w-full bg-dark-300 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50">
                <option>Flood</option>
                <option>Earthquake</option>
                <option>Wildfire</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Situation Report</label>
              <textarea 
                rows={5}
                className="w-full bg-dark-300 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 resize-none font-mono text-sm"
                placeholder="Water levels rising 2ft/hr. Bridge collapsed. Multiple casualties reported..."
                defaultValue="Heavy rainfall continuous for 48 hours. River breached banks near Sector 4. Estimated 500+ homes flooded. Power grid failure."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Estimated Population Density</label>
              <input 
                type="number"
                className="w-full bg-dark-300 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                defaultValue={15000}
              />
            </div>

            <button 
              type="submit"
              disabled={analyzing}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4
                ${analyzing 
                  ? 'bg-dark-300 text-primary border border-primary/50' 
                  : 'bg-primary text-dark-400 hover:bg-white shadow-[0_0_20px_rgba(0,212,255,0.3)]'}`}
            >
              {analyzing ? (
                <><FiCpu className="animate-pulse" /> PROCESSING DATA STREAM...</>
              ) : (
                'INITIATE ANALYSIS'
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Output Section */}
      <div className="lg:col-span-7">
        {analyzing && (
          <div className="h-full flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-32 h-32 relative mb-8">
              <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-neon-purple/20 border-b-neon-purple rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <FiCpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-primary animate-pulse" />
            </div>
            <div className="font-mono text-primary tracking-widest text-sm text-center">
              <p>ANALYZING TOPOGRAPHY...</p>
              <p className="mt-2 opacity-70">CALCULATING RISK VECTORS...</p>
              <p className="mt-2 opacity-40">ESTIMATING RESOURCE REQUIREMENTS...</p>
            </div>
          </div>
        )}

        {!analyzing && !result && (
          <div className="h-full flex flex-col items-center justify-center min-h-[400px] text-gray-500 glass rounded-3xl border-dashed">
            <FiCpu size={48} className="mb-4 opacity-50" />
            <p>Awaiting data input for analysis...</p>
          </div>
        )}

        {result && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Top Cards Row */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="glass p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden border-accent/30 shadow-[0_0_30px_rgba(255,59,59,0.1)]">
                <div className="absolute inset-0 bg-accent/5"></div>
                <h4 className="text-gray-400 text-sm mb-2 relative z-10">AI Threat Score</h4>
                <div className="text-5xl font-bold text-accent mb-2 relative z-10">
                  <CountUp end={result.score} duration={2} />
                  <span className="text-2xl text-accent/50">/100</span>
                </div>
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-bold tracking-wider relative z-10">
                  {result.level.toUpperCase()}
                </span>
              </motion.div>
              
              <motion.div variants={itemVariants} className="glass p-6 rounded-3xl flex flex-col justify-center border-emerald-500/30">
                <FiUsers className="text-emerald-400 text-3xl mb-2" />
                <h4 className="text-gray-400 text-sm mb-1">Est. Affected Population</h4>
                <div className="text-4xl font-bold text-emerald-400">
                  <CountUp end={result.affected} duration={2} separator="," />
                </div>
              </motion.div>
            </div>

            {/* Resources Needed */}
            <motion.div variants={itemVariants} className="glass p-6 rounded-3xl">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <FiPackage className="text-neon-purple" /> Recommended Resource Allocation
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {result.resources.map((res, i) => (
                  <div key={i} className="bg-dark-300/50 p-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neon-purple"></div>
                    <span className="text-sm text-gray-300">{res}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Directives */}
            <motion.div variants={itemVariants} className="glass p-6 rounded-3xl border-primary/20 bg-primary/5">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <FiShield className="text-primary" /> AI Strategic Directives
              </h4>
              <ul className="space-y-3">
                {result.instructions.map((inst, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-primary text-xs mt-1 bg-primary/20 px-1.5 py-0.5 rounded">0{i+1}</span>
                    <span className="text-sm text-gray-300 leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AIAnalyzer;
