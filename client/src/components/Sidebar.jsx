import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiAlertTriangle, FiMap, FiUsers, 
  FiPackage, FiBarChart2, FiUser, FiBell, FiShield, FiHeart, FiCpu
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const role = user?.role || user?.user?.role || 'citizen';

  const menuItems = {
    citizen: [
      { name: 'Dashboard', path: '/dashboard', icon: FiHome },
      { name: 'SOS', path: '/dashboard/sos', icon: FiHeart },
      { name: 'Report Disaster', path: '/dashboard/report', icon: FiAlertTriangle },
      { name: 'Live Map', path: '/dashboard/map', icon: FiMap },
      { name: 'AI Analyzer', path: '/dashboard/ai', icon: FiBarChart2 },
      { name: 'Alerts', path: '/dashboard/alerts', icon: FiBell },
      { name: 'Profile', path: '/dashboard/profile', icon: FiUser },
    ],
    volunteer: [
      { name: 'Field Agent Hub', path: '/dashboard', icon: FiHome },
      { name: 'Missions & Directives', path: '/dashboard/missions', icon: FiHeart },
      { name: 'Form Rescue Team', path: '/dashboard/teams', icon: FiUsers },
      { name: 'Live Sector Map', path: '/dashboard/map', icon: FiMap },
      { name: 'Civil Defense Alerts', path: '/dashboard/alerts', icon: FiBell },
      { name: 'Agent Profile', path: '/dashboard/profile', icon: FiUser },
    ],
    rescue_team: [
      { name: 'Command Center', path: '/dashboard', icon: FiShield },
      { name: 'Distress Triage', path: '/dashboard/sos', icon: FiAlertTriangle },
      { name: 'Tactical Map', path: '/dashboard/map', icon: FiMap },
      { name: 'Fleet & Resources', path: '/dashboard/resources', icon: FiPackage },
      { name: 'Flash Broadcasts', path: '/dashboard/alerts', icon: FiBell },
      { name: 'Operative Profile', path: '/dashboard/profile', icon: FiUser },
    ],
    admin: [
      { name: 'Master Overview', path: '/dashboard', icon: FiBarChart2 },
      { name: 'Reported Incidents', path: '/dashboard/report', icon: FiAlertTriangle },
      { name: 'Rescue & SOS Ops', path: '/dashboard/rescue', icon: FiShield },
      { name: 'Volunteer Roster', path: '/dashboard/volunteers', icon: FiHeart },
      { name: 'Live Grid Map', path: '/dashboard/map', icon: FiMap },
      { name: 'AI Threat Analyzer', path: '/dashboard/ai', icon: FiCpu },
      { name: 'Resource Inventory', path: '/dashboard/resources', icon: FiPackage },
      { name: 'Broadcast Alerts', path: '/dashboard/alerts', icon: FiBell },
      { name: 'User Management', path: '/dashboard/users', icon: FiUsers },
      { name: 'Admin Profile', path: '/dashboard/profile', icon: FiUser },
    ]
  };

  const links = menuItems[role] || menuItems.citizen;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -250 }}
        className={`fixed md:sticky top-0 left-0 h-screen w-64 glass-strong border-r border-white/10 z-50 pt-20 flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <nav className="space-y-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === '/dashboard' || link.path === '/dashboard/admin'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(0,212,255,0.15)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-300/50 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-neon-purple flex items-center justify-center">
              <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white truncate max-w-[120px]">{user?.name || 'User'}</span>
              <span className="text-xs text-primary capitalize">{role.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
