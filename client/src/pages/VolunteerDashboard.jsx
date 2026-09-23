import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiTarget, FiStar, FiClock, FiMapPin, FiCheckCircle, FiUser,
  FiHeart, FiShield, FiPackage, FiAward, FiCheckSquare, FiUsers,
  FiActivity, FiNavigation
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getAllSOS, getMyVolunteerProfile, acceptMission, completeMission } from '../api/endpoints';
import toast from 'react-hot-toast';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dutyStatus, setDutyStatus] = useState('STANDBY');
  const [checklist, setChecklist] = useState({
    ppe: true,
    radio: true,
    firstAid: false,
    gpsLock: true
  });
  const [supplyModal, setSupplyModal] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState('First Aid Kit');

  const fetchData = async () => {
    try {
      const [sosRes, profRes] = await Promise.all([
        getAllSOS().catch(() => ({ data: { data: [] } })),
        getMyVolunteerProfile().catch(() => null)
      ]);

      if (sosRes.data?.data) {
        setMissions(sosRes.data.data);
      }
      if (profRes && profRes.data?.data) {
        setProfile(profRes.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch volunteer data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAccept = async (id) => {
    try {
      await acceptMission(id);
      toast.success("Directive Accepted! Status set to EN ROUTE.");
      setDutyStatus('EN ROUTE');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept directive");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeMission(id);
      toast.success("Mission Completed! +150 Field XP Awarded.");
      setDutyStatus('STANDBY');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete directive");
    }
  };

  const handleDutyChange = (status) => {
    setDutyStatus(status);
    toast.success(`Agent Duty Status updated to ${status}`);
  };

  const toggleChecklist = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRequestSupply = (e) => {
    e.preventDefault();
    toast.success(`Requisition request for ${selectedSupply} logged at nearest depot.`);
    setSupplyModal(false);
  };

  // XP calculation
  const completedCount = profile?.missionsCompleted || 0;
  const currentXP = (completedCount * 150) + (profile?.points || 0);
  const level = Math.floor(currentXP / 300) + 1;
  const nextLevelXP = level * 300;
  const progressPercent = Math.min(100, Math.round(((currentXP % 300) / 300) * 100));

  const pendingMissions = missions.filter(m => m.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-strong p-6 rounded-3xl border border-emerald-500/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono uppercase">
              Field Agent Roster
            </span>
            <span className="text-xs text-gray-400">• Active Sector Hub</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Field Hub • <span className="text-emerald-400">{user?.name || 'Agent'}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Community relief deployment, rescue assistance & field directives.</p>
        </div>

        {/* Live Duty Status Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-dark-300/80 p-1.5 rounded-2xl border border-white/10">
          {['STANDBY', 'ON DUTY', 'EN ROUTE', 'OFF DUTY'].map((status) => (
            <button
              key={status}
              onClick={() => handleDutyChange(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dutyStatus === status
                  ? 'bg-emerald-500 text-dark-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Gamification & XP Progress */}
      <div className="glass p-5 rounded-3xl border border-emerald-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">
            <FiAward />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-mono uppercase">Field Clearance Rank</div>
            <div className="text-lg font-bold text-white">Level {level} Elite Responder</div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-gray-400">XP Progress: <strong className="text-emerald-400">{currentXP} XP</strong></span>
            <span className="text-gray-400">Next Level: {nextLevelXP} XP</span>
          </div>
          <div className="w-full h-3 bg-dark-300 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-3xl border border-emerald-500/20">
          <div className="flex justify-between items-start">
            <p className="text-xs font-mono uppercase text-gray-400">Missions Executed</p>
            <FiTarget className="text-emerald-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{completedCount}</h3>
          <p className="text-xs text-emerald-400 font-mono mt-1">Lifetime</p>
        </div>
        <div className="glass p-5 rounded-3xl border border-yellow-500/20">
          <div className="flex justify-between items-start">
            <p className="text-xs font-mono uppercase text-gray-400">Field Reputation</p>
            <FiStar className="text-yellow-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{profile?.rating || '4.9'}/5.0</h3>
          <p className="text-xs text-yellow-400 font-mono mt-1">Agent Rating</p>
        </div>
        <div className="glass p-5 rounded-3xl border border-primary/20">
          <div className="flex justify-between items-start">
            <p className="text-xs font-mono uppercase text-gray-400">Deployment Points</p>
            <FiActivity className="text-primary" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{currentXP}</h3>
          <p className="text-xs text-primary font-mono mt-1">Total XP</p>
        </div>
        <div className="glass p-5 rounded-3xl border border-accent/20">
          <div className="flex justify-between items-start">
            <p className="text-xs font-mono uppercase text-gray-400">Pending Directives</p>
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping"></span>
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{pendingMissions.length}</h3>
          <p className="text-xs text-accent font-mono mt-1">Awaiting Acceptance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Directives + Quick Nav */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FiTarget className="text-emerald-400" /> Recent Field Directives
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-mono">
                {missions.length} TOTAL
              </span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSupplyModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-dark-300 hover:bg-dark-200 text-xs text-white border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FiPackage className="text-emerald-400" /> Supplies
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {missions.length > 0 ? missions.slice(0, 5).map((mission, i) => {
              const isMine = mission.assignedTeam?._id === user._id || mission.assignedTeam === user._id;

              return (
                <motion.div
                  key={mission._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass p-5 rounded-3xl border transition-all ${
                    mission.status === 'pending'
                      ? 'border-accent/30 hover:border-accent/60'
                      : mission.status === 'rescued'
                      ? 'border-emerald-500/20 opacity-80'
                      : 'border-white/10 hover:border-emerald-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs text-gray-400">DIR-{mission._id.slice(-5).toUpperCase()}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                          mission.priority === 'critical'
                            ? 'border-accent/50 text-accent bg-accent/10'
                            : 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                        }`}>
                          {mission.priority || 'High'} Priority
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          mission.status === 'pending' ? 'border-accent/40 text-accent bg-accent/10'
                          : mission.status === 'rescued' ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                          : 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10'
                        }`}>
                          {mission.status?.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-dark-300 px-2 py-0.5 rounded">+150 XP</span>
                      </div>
                      <h4 className="text-lg font-bold text-white">{mission.message || 'Civilian Distress Signal'}</h4>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1 font-mono shrink-0">
                      <FiClock /> {new Date(mission.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <FiMapPin className="text-emerald-400" /> {mission.location?.address || 'Coordinates Locked via GPS'}
                    {mission.citizen?.name && (
                      <span className="ml-2 text-xs bg-dark-300/80 px-2 py-0.5 rounded">• by {mission.citizen.name}</span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {mission.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleAccept(mission._id)}
                          className="flex-1 bg-emerald-500 hover:bg-white text-dark-400 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] cursor-pointer text-sm"
                        >
                          ACCEPT DIRECTIVE
                        </button>
                        <Link
                          to="/dashboard/teams"
                          className="px-5 py-2.5 bg-dark-300 hover:bg-dark-200 text-white border border-white/10 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                        >
                          <FiUsers className="text-emerald-400" /> Form Team
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 bg-dark-300 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-xl font-mono text-xs flex items-center justify-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          {isMine ? 'ASSIGNED TO YOU' : mission.status === 'rescued' ? '✓ MISSION COMPLETED' : 'UNDER OPERATION'}
                        </div>
                        {isMine && mission.status !== 'rescued' && (
                          <button
                            onClick={() => handleComplete(mission._id)}
                            className="flex-1 bg-accent/20 hover:bg-accent text-accent hover:text-white border border-accent/40 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-sm"
                          >
                            MARK COMPLETE
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>
              );
            }) : (
              <div className="p-10 text-center text-gray-500 bg-dark-300/40 rounded-3xl border border-white/5">
                <FiCheckCircle className="mx-auto text-3xl mb-2 text-emerald-400 opacity-60" />
                <p className="text-sm">All civilian directives in this sector are currently fulfilled.</p>
              </div>
            )}
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <Link to="/dashboard/missions" className="glass p-5 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all group flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl group-hover:bg-emerald-500 group-hover:text-dark-400 transition-all">
                <FiTarget />
              </div>
              <div>
                <h4 className="text-white font-bold group-hover:text-emerald-400 transition-colors">All Missions & Directives</h4>
                <p className="text-xs text-gray-400">Full queue with filters, search & XP tracking</p>
              </div>
            </Link>
            <Link to="/dashboard/teams" className="glass p-5 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all group flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl group-hover:bg-emerald-500 group-hover:text-dark-400 transition-all">
                <FiUsers />
              </div>
              <div>
                <h4 className="text-white font-bold group-hover:text-emerald-400 transition-colors">Form Rescue Team</h4>
                <p className="text-xs text-gray-400">Build squads, assign missions & deploy together</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Col: Checklist + Agent Identity */}
        <div className="space-y-6">
          {/* Pre-Deployment Safety Checklist */}
          <div className="glass p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <FiCheckSquare className="text-emerald-400" /> Pre-Deployment Gear Check
            </h3>
            <p className="text-xs text-gray-400 mb-4">Confirm required gear before dispatching to active zones.</p>
            <div className="space-y-2.5">
              {[
                { id: 'ppe', label: 'Safety Vest & High-Vis PPE' },
                { id: 'radio', label: 'Comms Transceiver / Radio' },
                { id: 'firstAid', label: 'Emergency Trauma Kit' },
                { id: 'gpsLock', label: 'ResQ Satellite GPS Beacon' },
              ].map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-dark-300/60 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                  <span className="text-xs font-medium text-gray-200">{item.label}</span>
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all text-xs ${
                    checklist[item.id]
                      ? 'bg-emerald-500 border-emerald-500 text-dark-400 font-bold'
                      : 'border-white/20 bg-dark-200'
                  }`}>
                    {checklist[item.id] && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Identity & Badges */}
          <div className="glass p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4">Agent Identity & Medals</h3>
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-dark-200 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl relative overflow-hidden">
                <FiUser className="relative z-10" />
                <div className="absolute inset-0 bg-emerald-500/10"></div>
              </div>
              <div>
                <h4 className="font-bold text-white">{user?.name || 'Agent'}</h4>
                <p className="text-xs text-emerald-400 font-mono">ID: V-{user?._id?.slice(-4).toUpperCase() || '7840'}</p>
                <p className="text-xs text-gray-400">Clearance: Level {level} Responder</p>
              </div>
            </div>

            <h4 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Earned Medals</h4>
            <div className="flex flex-wrap gap-2.5">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <FiShield size={14} /> First Responder
              </div>
              {completedCount >= 3 && (
                <div className="px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-1.5 text-xs text-yellow-400 font-mono">
                  <FiStar size={14} /> Crisis Veteran
                </div>
              )}
              {completedCount >= 5 && (
                <div className="px-3 py-1.5 rounded-xl bg-neon-purple/10 border border-neon-purple/30 flex items-center gap-1.5 text-xs text-neon-purple font-mono">
                  <FiHeart size={14} /> Life Saver
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Supply Requisition Modal */}
      <AnimatePresence>
        {supplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-300 border border-emerald-500/40 p-6 sm:p-8 rounded-3xl max-w-md w-full relative shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Field Supply Requisition</h3>
              <p className="text-xs text-gray-400 mb-6">Select equipment or relief material needed for active directives.</p>
              <form onSubmit={handleRequestSupply} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase mb-2">Select Item</label>
                  <select
                    value={selectedSupply}
                    onChange={(e) => setSelectedSupply(e.target.value)}
                    className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="First Aid Trauma Kit">First Aid Trauma Kit (x2)</option>
                    <option value="Purified Water Packs">Purified Water Packs (x10)</option>
                    <option value="Emergency MRE Rations">Emergency MRE Rations (x10)</option>
                    <option value="High-Vis Hazard Vest">High-Vis Hazard Vest (x1)</option>
                    <option value="Thermal Blankets">Thermal Emergency Blankets (x5)</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setSupplyModal(false)} className="flex-1 py-3 bg-dark-200 text-gray-400 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-3 bg-emerald-500 hover:bg-white text-dark-400 font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer">
                    Submit Requisition
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolunteerDashboard;
