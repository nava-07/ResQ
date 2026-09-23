import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiTarget, FiMapPin, FiClock, FiCheckCircle, FiFilter, 
  FiAlertCircle, FiUsers, FiChevronDown, FiNavigation
} from 'react-icons/fi';
import { getAllSOS, acceptMission, completeMission } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const VolunteerMissions = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rescued

  const fetchMissions = async () => {
    try {
      const res = await getAllSOS();
      setMissions(res.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch missions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMissions(); }, []);

  const handleAccept = async (id) => {
    try {
      await acceptMission(id);
      toast.success('Directive Accepted! You are now deployed.');
      fetchMissions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeMission(id);
      toast.success('Mission Complete! +150 XP Awarded.');
      fetchMissions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete');
    }
  };

  const filtered = missions.filter(m => filter === 'all' || m.status === filter);

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'critical': return { bg: 'bg-accent/15', text: 'text-accent', border: 'border-accent/50', label: 'CRITICAL' };
      case 'high': return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/50', label: 'HIGH' };
      case 'medium': return { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/50', label: 'MEDIUM' };
      default: return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/50', label: 'STANDARD' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'bg-accent/15 text-accent border-accent/40';
      case 'accepted': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40';
      case 'on_the_way': return 'bg-primary/15 text-primary border-primary/40';
      case 'rescued': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
      case 'closed': return 'bg-gray-500/15 text-gray-400 border-gray-500/40';
      default: return 'bg-white/10 text-gray-400 border-white/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FiTarget className="text-emerald-400" /> Active Field Directives
          </h1>
          <p className="text-gray-400 text-sm mt-1">Accept emergency missions, assist civilians, and earn deployment XP.</p>
        </div>

        <Link
          to="/dashboard/teams"
          className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold hover:bg-emerald-500 hover:text-dark-400 transition-all flex items-center gap-2"
        >
          <FiUsers /> Form Rescue Team
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="glass p-3 rounded-2xl flex flex-wrap items-center gap-2">
        <FiFilter className="text-gray-400 ml-2" />
        {['all', 'pending', 'accepted', 'rescued', 'closed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
              filter === f
                ? 'bg-emerald-500 text-dark-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-gray-400 hover:text-white bg-dark-300/50'
            }`}
          >
            {f === 'all' ? `All (${missions.length})` : `${f} (${missions.filter(m => m.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Missions List */}
      <div className="space-y-4">
        {filtered.length > 0 ? filtered.map((mission, i) => {
          const isMine = mission.assignedTeam?._id === user._id || mission.assignedTeam === user._id;
          const priority = getPriorityStyle(mission.priority);

          return (
            <motion.div
              key={mission._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`glass p-6 rounded-3xl border transition-all ${
                mission.status === 'pending' 
                  ? 'border-accent/30 hover:border-accent/60' 
                  : mission.status === 'rescued'
                  ? 'border-emerald-500/20 opacity-80'
                  : 'border-white/10 hover:border-emerald-500/40'
              }`}
            >
              {/* Top Row: ID, Priority, Status, Time */}
              <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs text-gray-400 bg-dark-300/80 px-2.5 py-1 rounded-lg">
                    DIR-{mission._id.slice(-5).toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border uppercase ${priority.bg} ${priority.text} ${priority.border}`}>
                    {priority.label} PRIORITY
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border uppercase ${getStatusStyle(mission.status)}`}>
                    {mission.status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                  <FiClock size={12} />
                  {new Date(mission.createdAt).toLocaleString()}
                </div>
              </div>

              {/* Mission Content */}
              <h3 className="text-xl font-bold text-white mb-2">
                {mission.message || 'Civilian Emergency Distress Signal'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-dark-300/50 p-3 rounded-xl border border-white/5">
                  <FiMapPin className="text-emerald-400 shrink-0" />
                  <span className="truncate">{mission.location?.address || 'GPS Coordinates Locked'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-dark-300/50 p-3 rounded-xl border border-white/5">
                  <FiUsers className="text-primary shrink-0" />
                  <span>Reported by: {mission.citizen?.name || 'Civilian'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300 bg-dark-300/50 p-3 rounded-xl border border-white/5">
                  <FiNavigation className="text-neon-purple shrink-0" />
                  <span>XP Reward: <strong className="text-emerald-400">+150 XP</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {mission.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAccept(mission._id)}
                      className="flex-1 min-w-[200px] py-3 rounded-xl bg-emerald-500 hover:bg-white text-dark-400 text-sm font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                    >
                      ACCEPT & DEPLOY
                    </button>
                    <Link
                      to="/dashboard/teams"
                      className="px-6 py-3 rounded-xl bg-dark-300 hover:bg-dark-200 text-white text-sm font-bold border border-white/10 transition-all flex items-center gap-2"
                    >
                      <FiUsers className="text-emerald-400" /> Form Team First
                    </Link>
                  </>
                ) : mission.status === 'accepted' || mission.status === 'on_the_way' ? (
                  <>
                    <div className="flex-1 py-3 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-sm font-mono font-bold text-center flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                      {isMine ? 'YOUR ACTIVE MISSION' : 'ASSIGNED TO ANOTHER AGENT'}
                    </div>
                    {isMine && (
                      <button
                        onClick={() => handleComplete(mission._id)}
                        className="px-8 py-3 rounded-xl bg-accent/20 hover:bg-accent text-accent hover:text-white border border-accent/40 text-sm font-bold transition-all cursor-pointer"
                      >
                        MARK MISSION COMPLETE
                      </button>
                    )}
                  </>
                ) : (
                  <div className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-sm font-mono font-bold text-center flex items-center justify-center gap-2">
                    <FiCheckCircle /> RESCUE COMPLETED SUCCESSFULLY
                  </div>
                )}
              </div>
            </motion.div>
          );
        }) : (
          <div className="p-16 text-center glass rounded-3xl border border-white/10">
            <FiCheckCircle className="mx-auto text-4xl mb-3 text-emerald-400 opacity-60" />
            <h3 className="text-lg font-bold text-white mb-1">Sector Clear</h3>
            <p className="text-sm text-gray-400">No {filter === 'all' ? '' : filter} directives currently in the queue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerMissions;
