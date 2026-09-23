import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiRadio, FiAlertCircle, FiShield, FiSend,
  FiTruck, FiAnchor, FiWind, FiActivity, FiCheckCircle, FiVolume2,
  FiMapPin, FiClock, FiMap
} from 'react-icons/fi';
import { getAllSOS, updateSOSStatus, getVolunteers, createAlert, getDisasters } from '../api/endpoints';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const RescueDashboard = () => {
  const { user } = useAuth();
  const [sosRequests, setSosRequests] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [evacuatedCount, setEvacuatedCount] = useState(0);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [loading, setLoading] = useState(true);

  const [fleetUnits, setFleetUnits] = useState([
    { id: 'UNIT-ALPHA', name: 'Rapid Flood Boat 01', type: 'Marine', icon: FiAnchor, status: 'ON SCENE', crew: 4 },
    { id: 'UNIT-BRAVO', name: 'Trauma Ambulance 04', type: 'Medical', icon: FiTruck, status: 'DISPATCHED', crew: 3 },
    { id: 'AIR-WING-1', name: 'Search Helicopter 02', type: 'Air', icon: FiWind, status: 'STANDBY', crew: 2 },
    { id: 'SQUAD-DELTA', name: 'Heavy Extraction Unit', type: 'Urban', icon: FiShield, status: 'ON SCENE', crew: 6 },
  ]);

  const fetchData = async () => {
    try {
      const [sosRes, disRes] = await Promise.all([
        getAllSOS().catch(() => ({ data: { data: [] } })),
        getDisasters().catch(() => ({ data: { data: [] } }))
      ]);

      const sosList = sosRes.data?.data || [];
      setSosRequests(sosList);
      setEvacuatedCount(sosList.filter(s => s.status === 'rescued').length);
      setDisasters(disRes.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch rescue data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDispatch = async (id) => {
    try {
      await updateSOSStatus(id, { status: 'accepted' });
      toast.success("Rescue Squad Dispatched to Coordinates!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to dispatch team");
    }
  };

  const handleMarkRescued = async (id) => {
    try {
      await updateSOSStatus(id, { status: 'rescued' });
      toast.success("Victim Successfully Evacuated & Marked Rescued!");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const toggleUnitStatus = (index) => {
    setFleetUnits(prev => {
      const updated = [...prev];
      const current = updated[index].status;
      const next = current === 'STANDBY' ? 'DISPATCHED' : current === 'DISPATCHED' ? 'ON SCENE' : 'STANDBY';
      updated[index].status = next;
      return updated;
    });
    toast.success("Fleet Unit telemetry status updated.");
  };

  const handleFlashBroadcast = async (e) => {
    e.preventDefault();
    if (!alertText.trim()) return;
    try {
      await createAlert({
        title: 'TACTICAL RESCUE EVACUATION NOTICE',
        message: alertText,
        severity: 'critical'
      });
      toast.success("Flash Evacuation Alert Broadcasted to Sector!");
      setBroadcastModal(false);
      setAlertText('');
    } catch (err) {
      toast.error("Failed to transmit broadcast");
    }
  };

  const pendingSOS = sosRequests.filter(s => s.status === 'pending');
  const activeSOS = sosRequests.filter(s => s.status === 'accepted' || s.status === 'on_the_way');
  const activeDisasters = disasters.filter(d => d.status !== 'resolved');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-strong p-6 rounded-3xl border border-accent/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent/20 text-accent font-mono uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
              Level 4 Tactical Clearance
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <FiShield className="text-accent" /> Rescue Command Center
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">High-priority triage, fleet dispatch & civilian extraction.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/map" className="px-4 py-3 rounded-2xl bg-dark-300 text-white font-bold text-xs flex items-center gap-2 border border-white/10 hover:bg-dark-200 transition-all">
            <FiMap size={16} /> Tactical Map
          </Link>
          <button
            onClick={() => setBroadcastModal(true)}
            className="px-4 py-3 rounded-2xl bg-accent text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(255,59,59,0.4)] hover:bg-white hover:text-dark-400 transition-all cursor-pointer"
          >
            <FiVolume2 size={16} className="animate-pulse" /> FLASH ALERT
          </button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-3xl border border-accent/30">
          <div className="flex justify-between items-start">
            <p className="text-xs font-mono uppercase text-gray-400">Critical Distress</p>
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping"></span>
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{pendingSOS.length}</h3>
          <p className="text-xs text-accent font-mono mt-1">Pending Triage</p>
        </div>
        <div className="glass p-5 rounded-3xl border border-emerald-500/30">
          <div className="flex justify-between items-start">
            <p className="text-xs font-mono uppercase text-gray-400">Evacuated Civilians</p>
            <FiCheckCircle className="text-emerald-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{evacuatedCount}</h3>
          <p className="text-xs text-emerald-400 font-mono mt-1">Total Rescued</p>
        </div>
        <div className="glass p-5 rounded-3xl border border-primary/30">
          <div className="flex justify-between items-start">
            <p className="text-xs font-mono uppercase text-gray-400">Active Fleet Units</p>
            <FiTruck className="text-primary" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{fleetUnits.filter(u => u.status !== 'STANDBY').length} / {fleetUnits.length}</h3>
          <p className="text-xs text-primary font-mono mt-1">In Field</p>
        </div>
        <div className="glass p-5 rounded-3xl border border-yellow-500/30">
          <div className="flex justify-between items-start">
            <p className="text-xs font-mono uppercase text-gray-400">Active Disasters</p>
            <FiActivity className="text-yellow-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{activeDisasters.length}</h3>
          <p className="text-xs text-yellow-400 font-mono mt-1">In Sector</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Distress Triage Queue */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <FiRadio className="text-accent" /> Live Distress Signal Triage
            <span className="bg-accent/20 text-accent border border-accent/40 text-xs px-2.5 py-0.5 rounded-full font-mono">{sosRequests.length} TOTAL</span>
          </h3>

          <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {sosRequests.length > 0 ? sosRequests.map((sos) => (
              <motion.div
                key={sos._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-5 rounded-3xl border transition-all ${
                  sos.status === 'pending'
                    ? 'border-accent/50 bg-accent/5 shadow-[0_0_20px_rgba(255,59,59,0.1)]'
                    : sos.status === 'rescued'
                    ? 'border-emerald-500/30 bg-dark-300/60 opacity-70'
                    : 'border-yellow-500/40 bg-yellow-500/5'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {sos.status === 'pending' && <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>}
                    <h4 className="text-lg font-bold text-white">{sos.message || 'EMERGENCY DISTRESS BEACON'}</h4>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{new Date(sos.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-3 text-xs">
                  <div className="bg-dark-200/80 p-2.5 rounded-xl border border-white/5">
                    <span className="text-gray-400 block font-mono">ID</span>
                    <span className="text-white font-bold font-mono">#{sos._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="bg-dark-200/80 p-2.5 rounded-xl border border-white/5">
                    <span className="text-gray-400 block font-mono">TRIAGE</span>
                    <span className="text-accent font-bold uppercase font-mono">{sos.priority || 'HIGH'}</span>
                  </div>
                  <div className="bg-dark-200/80 p-2.5 rounded-xl border border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-gray-400 block font-mono">LOCATION</span>
                    <span className="text-primary font-bold truncate block">{sos.location?.address || sos.citizen?.name || 'GPS Locked'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 mt-4">
                  {sos.status === 'pending' ? (
                    <button onClick={() => handleDispatch(sos._id)} className="flex-1 py-3 rounded-xl bg-accent hover:bg-white text-white hover:text-dark-400 text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,59,59,0.3)] cursor-pointer">
                      DISPATCH RESCUE SQUAD
                    </button>
                  ) : sos.status === 'accepted' || sos.status === 'on_the_way' ? (
                    <button onClick={() => handleMarkRescued(sos._id)} className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-white text-dark-400 text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer">
                      CONFIRM VICTIM EXTRACTION
                    </button>
                  ) : (
                    <div className="flex-1 py-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold text-center rounded-xl">
                      ✓ RESCUE MISSION ACCOMPLISHED
                    </div>
                  )}

                  {/* Direct Google Maps Navigation */}
                  <a
                    href={
                      sos.location?.coordinates && sos.location.coordinates.length === 2
                        ? `https://www.google.com/maps/dir/?api=1&destination=${sos.location.coordinates[1]},${sos.location.coordinates[0]}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sos.location?.address || 'Incident Location')}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-3 rounded-xl bg-dark-200 hover:bg-white/10 text-primary border border-primary/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    title="Open Google Maps Navigation"
                  >
                    <FiMap size={14} /> Google Maps
                  </a>
                </div>
              </motion.div>
            )) : (
              <div className="p-12 text-center text-gray-500 glass rounded-3xl border border-white/10">
                <FiCheckCircle className="mx-auto text-3xl mb-2 text-emerald-400 opacity-60" />
                <p className="text-sm">Zero active distress signals in sector.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Fleet Status Board */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass p-6 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiTruck className="text-accent" /> Fleet Status Board
              </h3>
              <span className="text-xs text-gray-400 font-mono">LIVE</span>
            </div>
            <div className="space-y-3">
              {fleetUnits.map((unit, index) => {
                const Icon = unit.icon;
                return (
                  <div key={unit.id} className="p-4 rounded-2xl bg-dark-300/70 border border-white/5 hover:border-accent/40 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center text-lg border border-accent/30">
                        <Icon />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">{unit.name}</h5>
                        <p className="text-xs text-gray-400 font-mono">{unit.id} • Crew: {unit.crew}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleUnitStatus(index)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        unit.status === 'ON SCENE' ? 'bg-accent/20 text-accent border border-accent/40'
                        : unit.status === 'DISPATCHED' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {unit.status}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Disaster Incidents */}
          <div className="glass p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <FiAlertCircle className="text-yellow-400" /> Active Disaster Incidents
            </h3>
            <div className="space-y-2">
              {activeDisasters.length > 0 ? activeDisasters.slice(0, 4).map(d => (
                <div key={d._id} className="p-3 rounded-2xl bg-dark-300/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white capitalize">{d.type} — {d.severity}</h5>
                    <p className="text-[10px] text-gray-400 font-mono">{d.location?.address || 'Coordinates locked'}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    d.severity === 'critical' ? 'border-accent/40 text-accent bg-accent/10' : 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10'
                  }`}>{d.status?.toUpperCase()}</span>
                </div>
              )) : (
                <p className="text-sm text-gray-500 text-center py-4">No active incidents reported.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Flash Broadcast Modal */}
      <AnimatePresence>
        {broadcastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-dark-300 border border-accent/50 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-[0_0_50px_rgba(255,59,59,0.3)]">
              <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2"><FiVolume2 className="text-accent" /> Tactical Evacuation Alert</h3>
              <p className="text-xs text-gray-400 mb-6">Broadcast immediate emergency notice to all terminals in sector.</p>
              <form onSubmit={handleFlashBroadcast} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 uppercase mb-2">Warning Directive</label>
                  <textarea rows={4} required value={alertText} onChange={(e) => setAlertText(e.target.value)} placeholder="e.g., FLASH FLOOD: Evacuate North Bank sectors immediately." className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3.5 text-sm focus:outline-none focus:border-accent" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setBroadcastModal(false)} className="flex-1 py-3 bg-dark-200 text-gray-400 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer">Cancel</button>
                  <button type="submit" className="flex-1 py-3 bg-accent hover:bg-white text-white hover:text-dark-400 font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(255,59,59,0.4)] cursor-pointer">TRANSMIT ALERT</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RescueDashboard;
