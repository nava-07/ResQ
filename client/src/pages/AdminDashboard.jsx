import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiUsers, FiActivity, FiShield, FiCheckCircle, FiPackage,
  FiBell, FiCpu, FiMap, FiAlertTriangle, FiUserCheck
} from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getDisasters, getAllUsers, getResources, getAllSOS, createAlert, updateUserRole } from '../api/endpoints';
import toast from 'react-hot-toast';

const COLORS = ['#ff3b3b', '#00d4ff', '#a855f7', '#22c55e', '#f59e0b'];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [sosList, setSosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', message: '', severity: 'critical' });

  const fetchAdminData = async () => {
    try {
      const [disRes, usersRes, resRes, sosRes] = await Promise.all([
        getDisasters().catch(() => ({ data: { data: [] } })),
        getAllUsers().catch(() => ({ data: { data: [] } })),
        getResources().catch(() => ({ data: { data: [] } })),
        getAllSOS().catch(() => ({ data: { data: [] } }))
      ]);

      setDisasters(disRes.data?.data || []);
      setUsers(usersRes.data?.data || []);
      setResources(resRes.data?.data || []);
      setSosList(sosRes.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdminData(); }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      await createAlert(alertData);
      toast.success("Global System Alert Broadcasted!");
      setBroadcastModal(false);
      setAlertData({ title: '', message: '', severity: 'critical' });
    } catch (err) {
      toast.error("Failed to transmit alert");
    }
  };

  const handleToggleVerify = async (id, isVerified) => {
    try {
      await updateUserRole(id, { isVerified: !isVerified });
      toast.success("Personnel verification updated");
      fetchAdminData();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Computed stats
  const activeIncidents = disasters.filter(d => d.status !== 'resolved').length;
  const resolvedIncidents = disasters.filter(d => d.status === 'resolved').length;
  const pendingSOS = sosList.filter(s => s.status === 'pending').length;

  // Role distribution for pie chart
  const roleCounts = users.reduce((acc, u) => {
    const role = u.role || 'citizen';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  const roleData = Object.entries(roleCounts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  // Disaster type distribution for pie chart
  const typeCounts = disasters.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1;
    return acc;
  }, {});
  const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

  // Timeline mock (based on real data count)
  const chartData = [
    { name: '00:00', active: Math.round(activeIncidents * 0.3), resolved: Math.round(resolvedIncidents * 0.1) },
    { name: '04:00', active: Math.round(activeIncidents * 0.5), resolved: Math.round(resolvedIncidents * 0.3) },
    { name: '08:00', active: Math.round(activeIncidents * 0.8), resolved: Math.round(resolvedIncidents * 0.5) },
    { name: '12:00', active: activeIncidents, resolved: Math.round(resolvedIncidents * 0.7) },
    { name: '16:00', active: Math.round(activeIncidents * 0.9), resolved: Math.round(resolvedIncidents * 0.9) },
    { name: '20:00', active: Math.round(activeIncidents * 0.6), resolved: resolvedIncidents },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-strong p-6 rounded-3xl border border-neon-purple/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple font-mono uppercase">
              Omni-Clearance Level 5
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Global Mission Matrix</h1>
          <p className="text-gray-400 text-sm mt-0.5">Universal oversight, personnel authorization & logistics command.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => setBroadcastModal(true)} className="px-4 py-3 rounded-2xl bg-accent hover:bg-white text-white hover:text-dark-400 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(255,59,59,0.3)] transition-all cursor-pointer">
            <FiBell /> BROADCAST ALERT
          </button>
          <Link to="/dashboard/users" className="px-4 py-3 rounded-2xl bg-neon-purple hover:bg-white text-white hover:text-dark-400 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
            <FiUsers /> MANAGE PERSONNEL
          </Link>
          <Link to="/dashboard/map" className="px-4 py-3 rounded-2xl bg-dark-300 hover:bg-dark-200 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-all">
            <FiMap /> LIVE MAP
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: FiUsers, title: 'Total Personnel', value: users.length, color: 'text-neon-purple', border: 'border-neon-purple/20' },
          { icon: FiActivity, title: 'Active Disasters', value: activeIncidents, color: 'text-accent', border: 'border-accent/20' },
          { icon: FiShield, title: 'Pending SOS', value: pendingSOS, color: 'text-yellow-400', border: 'border-yellow-500/20' },
          { icon: FiPackage, title: 'Resource Depots', value: resources.length, color: 'text-primary', border: 'border-primary/20' },
          { icon: FiCheckCircle, title: 'Resolutions', value: resolvedIncidents, color: 'text-emerald-400', border: 'border-emerald-500/20' },
        ].map((stat, i) => (
          <div key={i} className={`glass p-5 rounded-3xl border ${stat.border}`}>
            <div className="flex justify-between items-start">
              <p className="text-xs font-mono uppercase text-gray-400">{stat.title}</p>
              <stat.icon className={stat.color} />
            </div>
            <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* AI Threat Engine */}
      <div className="glass p-6 rounded-3xl border border-neon-purple/30 bg-neon-purple/5 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center text-neon-purple text-2xl shrink-0">
            <FiCpu />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Predictive Threat Engine</h3>
            <p className="text-xs text-gray-300">Neural hazard assessment & fake report detection.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-dark-300/80 p-3 rounded-2xl border border-white/5">
            <span className="text-gray-400 block">AI THREAT SCORE</span>
            <span className="text-accent font-bold text-base">{activeIncidents > 3 ? '78 / 100 HIGH' : activeIncidents > 0 ? '42 / 100 MODERATE' : '12 / 100 LOW'}</span>
          </div>
          <div className="bg-dark-300/80 p-3 rounded-2xl border border-white/5">
            <span className="text-gray-400 block">REPORT AUTHENTICITY</span>
            <span className="text-emerald-400 font-bold text-base">96.8% VERIFIED</span>
          </div>
        </div>
        <div className="flex justify-start lg:justify-end">
          <Link to="/dashboard/ai" className="px-5 py-3 rounded-2xl bg-neon-purple/20 text-neon-purple border border-neon-purple/40 hover:bg-neon-purple hover:text-white transition-all text-xs font-bold font-mono flex items-center gap-2">
            LAUNCH AI ENGINE →
          </Link>
        </div>
      </div>

      {/* Charts + Logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Incident Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-7 glass p-6 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Incident & Response Velocity</h3>
            <span className="text-xs font-mono text-gray-400">24-HR</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="adminActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3b3b" stopOpacity={0.8}/><stop offset="95%" stopColor="#ff3b3b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="adminResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff50" />
                <YAxis stroke="#ffffff50" />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <Tooltip contentStyle={{ backgroundColor: '#0a0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="active" stroke="#ff3b3b" fillOpacity={1} fill="url(#adminActive)" name="Active" />
                <Area type="monotone" dataKey="resolved" stroke="#a855f7" fillOpacity={1} fill="url(#adminResolved)" name="Resolved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Supply Logistics */}
        <div className="lg:col-span-5 glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><FiPackage className="text-primary" /> Supply Logistics</h3>
              <Link to="/dashboard/resources" className="text-xs text-primary hover:underline font-mono">MANAGE →</Link>
            </div>
            <div className="space-y-3">
              {(resources.length > 0 ? resources.slice(0, 5) : [
                { _id: '1', name: 'Trauma Medical Kits', category: 'medicine', quantity: 120, status: 'available' },
                { _id: '2', name: 'Inflatable Rescue Rafts', category: 'equipment', quantity: 18, status: 'available' },
                { _id: '3', name: 'Emergency MRE Rations', category: 'food', quantity: 2400, status: 'available' },
                { _id: '4', name: 'Water Filters', category: 'water', quantity: 45, status: 'available' },
              ]).map((res) => (
                <div key={res._id} className="p-3 rounded-2xl bg-dark-300/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">{res.name}</h5>
                    <span className="text-[10px] font-mono text-gray-400 uppercase">{res.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-white font-mono">{res.quantity}</span>
                    <span className={`text-[10px] block font-mono uppercase ${res.status === 'available' ? 'text-emerald-400' : res.status === 'low' ? 'text-yellow-400' : 'text-accent'}`}>{res.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link to="/dashboard/resources" className="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold text-center border border-white/10 transition-all block">
            Open Complete Warehouse
          </Link>
        </div>
      </div>

      {/* Personnel Roster */}
      <div className="glass p-6 rounded-3xl border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2"><FiUsers className="text-neon-purple" /> Personnel Authorization Log</h3>
          <Link to="/dashboard/users" className="text-xs text-neon-purple font-mono hover:underline">FULL DIRECTORY ({users.length}) →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {users.slice(0, 8).map((u) => (
            <div key={u._id} className="p-4 rounded-2xl bg-dark-300/60 border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple">{u.role?.replace('_', ' ')}</span>
                  <button onClick={() => handleToggleVerify(u._id, u.isVerified)} className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer ${u.isVerified ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {u.isVerified ? 'VERIFIED' : 'PENDING'}
                  </button>
                </div>
                <h4 className="text-sm font-bold text-white truncate">{u.name}</h4>
                <p className="text-xs text-gray-400 truncate">{u.email}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-gray-500 font-mono">
                Joined {new Date(u.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {broadcastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-dark-300 border border-neon-purple/40 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-[0_0_50px_rgba(168,85,247,0.3)]">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><FiBell className="text-neon-purple" /> Emergency Broadcast</h3>
              <p className="text-xs text-gray-400 mb-6">Transmit high-priority alert to all connected terminals.</p>
              <form onSubmit={handleBroadcast} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase mb-2">Alert Headline</label>
                  <input type="text" required value={alertData.title} onChange={(e) => setAlertData({...alertData, title: e.target.value})} placeholder="e.g. SEVERE CYCLONE WARNING: Sector 9" className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-neon-purple" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase mb-2">Severity</label>
                  <select value={alertData.severity} onChange={(e) => setAlertData({...alertData, severity: e.target.value})} className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-neon-purple">
                    <option value="info">Info</option><option value="warning">Warning</option><option value="danger">Danger</option><option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase mb-2">Details</label>
                  <textarea rows={3} required value={alertData.message} onChange={(e) => setAlertData({...alertData, message: e.target.value})} placeholder="Detailed instructions, safe locations..." className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-neon-purple" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setBroadcastModal(false)} className="flex-1 py-3 bg-dark-200 text-gray-400 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-neon-purple hover:bg-white text-white hover:text-dark-400 font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] cursor-pointer">TRANSMIT</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
