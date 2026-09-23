import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiUsers, FiPlus, FiX, FiCheckCircle, FiMapPin, FiShield, 
  FiTarget, FiStar, FiUserPlus, FiTrash2, FiSend, FiRadio
} from 'react-icons/fi';
import { getVolunteers, getAllSOS } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TeamFormation = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Team builder state
  const [teams, setTeams] = useState([
    { 
      id: 'TEAM-ALPHA', 
      name: 'Alpha Response Unit', 
      members: [], 
      assignedMission: null, 
      status: 'FORMING' 
    }
  ]);
  const [activeTeamId, setActiveTeamId] = useState('TEAM-ALPHA');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volRes, sosRes] = await Promise.all([
          getVolunteers().catch(() => ({ data: { data: [] } })),
          getAllSOS().catch(() => ({ data: { data: [] } }))
        ]);
        setVolunteers(volRes.data?.data || []);
        setMissions((sosRes.data?.data || []).filter(m => m.status === 'pending'));
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeTeam = teams.find(t => t.id === activeTeamId);

  const addMember = (volunteer) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeamId) return t;
      if (t.members.find(m => m._id === volunteer._id)) {
        toast.error('Agent already in this team');
        return t;
      }
      toast.success(`${volunteer.user?.name || 'Agent'} added to ${t.name}`);
      return { ...t, members: [...t.members, volunteer] };
    }));
  };

  const removeMember = (volunteerId) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeamId) return t;
      return { ...t, members: t.members.filter(m => m._id !== volunteerId) };
    }));
  };

  const assignMission = (mission) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeamId) return t;
      toast.success(`Mission ${mission._id.slice(-5).toUpperCase()} assigned to ${t.name}`);
      return { ...t, assignedMission: mission };
    }));
  };

  const deployTeam = () => {
    if (!activeTeam) return;
    if (activeTeam.members.length === 0) {
      toast.error('Add at least one agent before deploying');
      return;
    }
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeamId) return t;
      return { ...t, status: 'DEPLOYED' };
    }));
    toast.success(`🚀 ${activeTeam.name} is now DEPLOYED! ${activeTeam.members.length} agents en route.`);
  };

  const createNewTeam = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    const id = `TEAM-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    setTeams(prev => [...prev, { id, name: newTeamName, members: [], assignedMission: null, status: 'FORMING' }]);
    setActiveTeamId(id);
    setNewTeamName('');
    setShowCreateModal(false);
    toast.success(`New team "${newTeamName}" created!`);
  };

  const deleteTeam = (id) => {
    if (teams.length <= 1) {
      toast.error('Must have at least one team');
      return;
    }
    setTeams(prev => prev.filter(t => t.id !== id));
    if (activeTeamId === id) setActiveTeamId(teams[0]?.id);
    toast.success('Team disbanded');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FiUsers className="text-emerald-400" /> Rescue Team Formation
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Build squads from available volunteers, assign emergency missions, and deploy as a coordinated unit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/missions"
            className="px-4 py-2.5 rounded-2xl bg-dark-300 text-white border border-white/10 text-xs font-bold hover:bg-dark-200 transition-all flex items-center gap-2"
          >
            <FiTarget className="text-emerald-400" /> View All Missions
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 text-dark-400 text-xs font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-2"
          >
            <FiPlus /> New Team
          </button>
        </div>
      </div>

      {/* Team Tabs */}
      <div className="flex flex-wrap items-center gap-2 glass p-2 rounded-2xl">
        {teams.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTeamId(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTeamId === t.id
                ? 'bg-emerald-500 text-dark-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-gray-400 hover:text-white bg-dark-300/50'
            }`}
          >
            <FiShield size={14} />
            {t.name}
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              t.status === 'DEPLOYED' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-gray-300'
            }`}>
              {t.members.length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Team Builder & Members (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Team Card */}
          {activeTeam && (
            <div className={`glass-strong p-6 rounded-3xl border ${
              activeTeam.status === 'DEPLOYED' ? 'border-accent/40 bg-accent/5' : 'border-emerald-500/30'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">{activeTeam.name}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    ID: {activeTeam.id} • Status: <span className={activeTeam.status === 'DEPLOYED' ? 'text-accent' : 'text-emerald-400'}>{activeTeam.status}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {activeTeam.status === 'FORMING' && (
                    <button
                      onClick={deployTeam}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-white text-dark-400 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer flex items-center gap-1.5"
                    >
                      <FiSend size={14} /> DEPLOY TEAM
                    </button>
                  )}
                  {teams.length > 1 && (
                    <button
                      onClick={() => deleteTeam(activeTeam.id)}
                      className="p-2 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-white border border-accent/20 transition-all cursor-pointer"
                      title="Disband Team"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Assigned Mission */}
              {activeTeam.assignedMission ? (
                <div className="mb-4 p-4 rounded-2xl bg-dark-300/70 border border-emerald-500/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">Assigned Mission</span>
                    <span className="text-[10px] font-mono text-accent">{activeTeam.assignedMission.priority?.toUpperCase()} PRIORITY</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{activeTeam.assignedMission.message || 'Emergency Distress'}</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><FiMapPin size={10} /> {activeTeam.assignedMission.location?.address || 'GPS Locked'}</p>
                </div>
              ) : (
                <div className="mb-4 p-4 rounded-2xl bg-dark-300/40 border border-dashed border-white/10 text-center">
                  <p className="text-xs text-gray-500">No mission assigned — select from pending missions panel →</p>
                </div>
              )}

              {/* Team Members */}
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiUsers className="text-emerald-400" /> Squad Members ({activeTeam.members.length})
              </h4>

              {activeTeam.members.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeTeam.members.map((vol) => (
                    <div key={vol._id} className="p-3.5 rounded-2xl bg-dark-300/60 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                          {vol.user?.name?.charAt(0)?.toUpperCase() || 'V'}
                        </div>
                        <div>
                          <h5 className="text-sm font-bold text-white">{vol.user?.name || 'Agent'}</h5>
                          <p className="text-[10px] text-gray-400 font-mono">
                            {vol.missionsCompleted || 0} missions • {vol.skills?.join(', ') || 'General'}
                          </p>
                        </div>
                      </div>
                      {activeTeam.status === 'FORMING' && (
                        <button
                          onClick={() => removeMember(vol._id)}
                          className="p-1.5 rounded-lg hover:bg-accent/20 text-gray-500 hover:text-accent transition-all cursor-pointer"
                        >
                          <FiX size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-2xl bg-dark-300/30 border border-dashed border-white/10">
                  <FiUserPlus className="mx-auto text-2xl mb-2 text-emerald-400 opacity-50" />
                  <p className="text-xs text-gray-500">Add volunteers from the roster on the right →</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Available Volunteers & Pending Missions (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Available Volunteers Roster */}
          <div className="glass p-5 rounded-3xl border border-white/10 max-h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiUsers className="text-emerald-400" /> Available Agents
              </h3>
              <span className="text-xs text-gray-400 font-mono">{volunteers.length} TOTAL</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {volunteers.length > 0 ? volunteers.map((vol) => (
                <div key={vol._id} className="p-3 rounded-2xl bg-dark-300/50 border border-white/5 flex items-center justify-between hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-dark-200 border border-white/10 flex items-center justify-center text-white font-bold text-xs">
                      {vol.user?.name?.charAt(0)?.toUpperCase() || 'V'}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white leading-tight">{vol.user?.name || 'Volunteer'}</h5>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <FiStar size={10} className="text-yellow-400" />
                        <span className="text-[10px] text-gray-400">{vol.rating || '4.8'} • {vol.missionsCompleted || 0} ops</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${vol.availability ? 'bg-emerald-400' : 'bg-gray-500'}`}></span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => addMember(vol)}
                    disabled={activeTeam?.status === 'DEPLOYED'}
                    className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-dark-400 border border-emerald-500/30 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              )) : (
                <div className="p-6 text-center text-gray-500 text-xs">No volunteer agents registered.</div>
              )}
            </div>
          </div>

          {/* Pending Missions to Assign */}
          <div className="glass p-5 rounded-3xl border border-white/10 max-h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiRadio className="text-accent" /> Pending Missions
              </h3>
              <span className="text-xs text-accent font-mono">{missions.length} ACTIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {missions.length > 0 ? missions.map((mission) => (
                <div key={mission._id} className="p-3 rounded-2xl bg-dark-300/50 border border-accent/20 flex items-center justify-between hover:border-accent/40 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-mono text-gray-400">#{mission._id.slice(-5).toUpperCase()}</span>
                      <span className="text-[10px] font-mono text-accent uppercase">{mission.priority || 'high'}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white truncate max-w-[200px]">{mission.message || 'Distress Signal'}</h5>
                  </div>
                  <button
                    onClick={() => assignMission(mission)}
                    disabled={activeTeam?.status === 'DEPLOYED'}
                    className="px-3 py-1.5 rounded-xl bg-accent/15 text-accent hover:bg-accent hover:text-white border border-accent/30 text-[10px] font-bold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ASSIGN
                  </button>
                </div>
              )) : (
                <div className="p-6 text-center text-gray-500 text-xs">No pending missions available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-dark-300 border border-emerald-500/40 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Create New Rescue Team</h3>
              <p className="text-xs text-gray-400 mb-6">Name your squad and start recruiting agents.</p>

              <form onSubmit={createNewTeam} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase mb-2">Team Name</label>
                  <input
                    type="text"
                    required
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="e.g. Bravo Extraction Unit"
                    className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-dark-200 text-gray-400 hover:text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-500 hover:bg-white text-dark-400 font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                  >
                    CREATE TEAM
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

export default TeamFormation;
