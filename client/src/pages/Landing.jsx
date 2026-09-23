import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { FiActivity, FiMap, FiShield, FiHeart, FiCpu, FiUsers, FiGithub, FiTwitter, FiAlertTriangle } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const Landing = () => {
  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-dark-400/80 to-dark-400"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                Intelligent <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-neon-purple animate-bg-gradient">
                  Disaster Response
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                An AI-powered emergency platform orchestrating rescue operations, predicting risks, and saving lives through real-time coordination.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link 
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-dark-400 font-bold rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:-translate-y-1 text-center"
              >
                Get Started
              </Link>
              <Link 
                to="/emergency-sos"
                className="w-full sm:w-auto px-8 py-4 bg-accent/10 text-accent font-bold rounded-full border border-accent/50 hover:bg-accent hover:text-white transition-all shadow-[0_0_20px_rgba(255,59,59,0.2)] hover:shadow-[0_0_30px_rgba(255,59,59,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <FiActivity className="animate-pulse" /> Emergency SOS
              </Link>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Active Disasters', value: 2847, suffix: '', icon: <div className="w-2 h-2 rounded-full bg-accent animate-ping absolute -top-1 -right-1"></div> },
              { label: 'People Rescued', value: 15302, suffix: '+' },
              { label: 'Volunteers Online', value: 8429, suffix: '' },
              { label: 'Resources Delivered', value: 45120, suffix: '+' }
            ].map((stat, i) => (
              <div key={i} className="glass p-6 rounded-2xl text-center relative border-white/5 hover:border-primary/30 transition-colors">
                <div className="relative inline-block">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <CountUp end={stat.value} duration={2.5} separator="," />{stat.suffix}
                  </h3>
                  {stat.icon}
                </div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 relative bg-dark-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">A seamless workflow designed for rapid response when seconds matter.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FiAlertTriangle, title: '1. Report', desc: 'Citizens report incidents via app or SOS button with automatic geolocation.' },
              { icon: FiCpu, title: '2. AI Analysis', desc: 'Our AI instantly assesses severity, predicts spread, and determines required resources.' },
              { icon: FiShield, title: '3. Response', desc: 'Rescue teams and volunteers are automatically dispatched to the exact location.' }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-strong p-8 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-neon-purple transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Command Center Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Everything you need to manage a crisis effectively.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FiCpu, title: 'AI Disaster Analysis', desc: 'Predictive models for disaster spread and impact assessment.' },
              { icon: FiMap, title: 'Live Maps', desc: 'Real-time tracking of incidents, rescue teams, and resources.' },
              { icon: FiHeart, title: 'Emergency SOS', desc: 'One-tap emergency alerts with precise location tracking.' },
              { icon: FiActivity, title: 'Real-time Tracking', desc: 'Live updates on rescue operations and volunteer status.' },
              { icon: FiUsers, title: 'Volunteer Network', desc: 'Coordinate thousands of volunteers based on proximity and skills.' },
              { icon: FiShield, title: 'Resource Management', desc: 'Track and deploy critical supplies where they are needed most.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl hover:bg-white/5 transition-colors border border-white/5 hover:border-primary/30"
              >
                <feature.icon className="text-primary mb-4" size={24} />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-300/80 border-t border-white/10 pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50">
                  <span className="text-primary font-bold">R</span>
                </div>
                <span className="text-xl font-bold text-white">ResQ</span>
              </Link>
              <p className="text-gray-400 max-w-sm">
                Empowering communities and rescue teams with AI-driven tools to respond faster and save more lives during crises.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/dashboard/map" className="hover:text-primary transition-colors">Live Map</Link></li>
                <li><Link to="/dashboard/ai" className="hover:text-primary transition-colors">AI Analysis</Link></li>
                <li><Link to="/emergency-sos" className="hover:text-accent transition-colors font-bold text-accent">Emergency SOS</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Portal Gateway</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Portals</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/login/citizen" className="hover:text-primary transition-colors">Citizen Login</Link></li>
                <li><Link to="/login/volunteer" className="hover:text-emerald-400 transition-colors">Volunteer Login</Link></li>
                <li><Link to="/login/rescue" className="hover:text-accent transition-colors">Rescue Team Login</Link></li>
                <li><Link to="/login/admin" className="hover:text-neon-purple transition-colors">Admin Terminal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">© 2026 ResQ Platform. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0 text-gray-400">
              <a href="#" className="hover:text-white transition-colors"><FiGithub size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><FiTwitter size={20} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
