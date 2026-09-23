import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiHeart, FiShield, FiCpu, FiArrowRight, FiActivity } from 'react-icons/fi';

const Login = () => {
  const portals = [
    {
      id: 'citizen',
      title: 'Citizen Portal',
      subtitle: 'Emergency assistance, incident reporting & live alerts',
      path: '/login/citizen',
      icon: FiUser,
      color: 'text-primary',
      bg: 'bg-primary',
      border: 'border-primary/40',
      hoverBorder: 'hover:border-primary',
      glow: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]',
      badge: 'Public Access'
    },
    {
      id: 'volunteer',
      title: 'Volunteer Hub',
      subtitle: 'Field missions, community relief & disaster aid directives',
      path: '/login/volunteer',
      icon: FiHeart,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500',
      border: 'border-emerald-500/40',
      hoverBorder: 'hover:border-emerald-500',
      glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      badge: 'Field Agents'
    },
    {
      id: 'rescue',
      title: 'Rescue Ops',
      subtitle: 'Emergency distress response, live tracking & team dispatch',
      path: '/login/rescue',
      icon: FiShield,
      color: 'text-accent',
      bg: 'bg-accent',
      border: 'border-accent/40',
      hoverBorder: 'hover:border-accent',
      glow: 'hover:shadow-[0_0_30px_rgba(255,59,59,0.3)]',
      badge: 'Rapid Response'
    },
    {
      id: 'admin',
      title: 'Omni Terminal',
      subtitle: 'Global oversight, threat analytics & resource management',
      path: '/login/admin',
      icon: FiCpu,
      color: 'text-neon-purple',
      bg: 'bg-neon-purple',
      border: 'border-neon-purple/40',
      hoverBorder: 'hover:border-neon-purple',
      glow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
      badge: 'System Admin'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-400 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent/5 rounded-full blur-[160px]"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_20px_rgba(0,212,255,0.4)]">
              <span className="text-primary font-bold text-2xl">R</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-wider">
              Res<span className="text-primary">Q</span>
            </span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            SELECT CLEARANCE PORTAL
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
            Choose your designated portal below to access customized command tools and operational dashboards.
          </p>
        </div>

        {/* 4 Separate Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {portals.map((portal, index) => {
            const Icon = portal.icon;
            return (
              <motion.div
                key={portal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={portal.path}
                  className={`group relative block p-7 rounded-3xl glass-strong border ${portal.border} ${portal.hoverBorder} ${portal.glow} transition-all duration-300 hover:-translate-y-1.5`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl ${portal.bg}/15 border ${portal.border} flex items-center justify-center ${portal.color} text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon />
                    </div>
                    <span className={`text-xs font-mono uppercase px-3 py-1 rounded-full ${portal.bg}/10 ${portal.color} border ${portal.border}`}>
                      {portal.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-white flex items-center justify-between">
                    <span>{portal.title}</span>
                    <FiArrowRight className={`text-gray-500 ${portal.color} opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300`} />
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {portal.subtitle}
                  </p>

                  <div className={`w-full py-2.5 rounded-xl ${portal.bg}/20 ${portal.color} border ${portal.border} text-xs font-bold text-center group-hover:${portal.bg} group-hover:text-dark-400 transition-all`}>
                    ENTER {portal.title.toUpperCase()} →
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Footer & Registration link */}
        <div className="text-center text-sm text-gray-400 pt-4">
          Need a new account?{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Register Personnel Clearance
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
