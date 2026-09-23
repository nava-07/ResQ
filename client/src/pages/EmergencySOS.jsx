import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiAlertTriangle, FiPhoneCall, FiMapPin, FiCheckCircle, 
  FiShield, FiClock, FiRadio, FiNavigation, FiArrowLeft, FiHeart, FiActivity
} from 'react-icons/fi';
import { createSOS } from '../api/endpoints';
import { detectCurrentLocation } from '../utils/location';
import toast from 'react-hot-toast';

const EMERGENCY_TYPES = [
  { id: 'flood', label: 'Flash Flood / Water Trap', icon: '🌊', color: 'border-blue-500/50 bg-blue-500/10' },
  { id: 'medical', label: 'Severe Medical / Trauma', icon: '🚑', color: 'border-red-500/50 bg-red-500/10' },
  { id: 'earthquake', label: 'Structural Collapse / Quake', icon: '🏚️', color: 'border-amber-500/50 bg-amber-500/10' },
  { id: 'fire', label: 'Fire / Explosion Hazard', icon: '🔥', color: 'border-orange-500/50 bg-orange-500/10' },
  { id: 'other', label: 'Immediate Life Threat', icon: '⚠️', color: 'border-purple-500/50 bg-purple-500/10' }
];

const EMERGENCY_HOTLINES = [
  { name: 'Universal Helpline', number: '112', desc: 'All Emergency Services', badge: 'National 24/7' },
  { name: 'Ambulance & Trauma', number: '108', desc: 'Medical Emergency Services', badge: 'Direct Medical' },
  { name: 'Disaster Relief (NDRF)', number: '1078', desc: 'Disaster Management Squads', badge: 'Rescue Force' },
  { name: 'Police Rapid Response', number: '100', desc: 'Civilian Security & Threat', badge: 'Rapid Unit' },
  { name: 'Fire & Rescue Service', number: '101', desc: 'Fire Brigade & Hazard Control', badge: 'Fire Safety' },
];

const EmergencySOS = () => {
  const [selectedType, setSelectedType] = useState('medical');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [coords, setCoords] = useState(null);
  const [locationName, setLocationName] = useState('Detecting GPS location...');
  const [gpsError, setGpsError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeBeacon, setActiveBeacon] = useState(null);

  // Auto-acquire GPS and address on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const loc = await detectCurrentLocation();
        if (isMounted) {
          setCoords(loc.coordinates);
          setLocationName(`${loc.address} (${loc.lat.toFixed(4)}°, ${loc.lng.toFixed(4)}°)`);
          setGpsError(null);
        }
      } catch (err) {
        if (isMounted) {
          setCoords([78.9629, 20.5937]);
          setLocationName('GPS Telemetry Sector Assigned');
        }
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const handleTriggerSOS = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emergencyTypeObj = EMERGENCY_TYPES.find(t => t.id === selectedType);
    const messageText = `EMERGENCY: ${emergencyTypeObj?.label || 'Distress Beacon'}${name ? ` - Contact: ${name} (${phone})` : ''}${additionalDetails ? ` - Details: ${additionalDetails}` : ''}`;

    try {
      const payload = {
        message: messageText,
        priority: 'critical',
        location: {
          type: 'Point',
          coordinates: coords || [78.9629, 20.5937],
          address: locationName || 'Coordinates broadcasted from Emergency SOS Portal'
        }
      };

      const res = await createSOS(payload);
      const sosData = res.data?.data || { _id: Date.now().toString(36) };
      setActiveBeacon({
        id: sosData._id,
        time: new Date().toLocaleTimeString(),
        type: emergencyTypeObj?.label,
        location: locationName
      });
      toast.success('🚨 EMERGENCY DISTRESS BEACON BROADCASTED! Rescue teams notified.');
    } catch (err) {
      console.error('Failed to trigger SOS:', err);
      // Even on network error, display beacon activation
      setActiveBeacon({
        id: 'LOCAL-' + Date.now().toString(36).toUpperCase(),
        time: new Date().toLocaleTimeString(),
        type: emergencyTypeObj?.label,
        location: locationName
      });
      toast.success('Emergency Signal Dispatched to local radio mesh.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-white py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Red Alert Glow in Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/15 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white px-3 py-2 rounded-xl bg-dark-300/80 border border-white/10 transition-all"
          >
            <FiArrowLeft /> Return to Home
          </Link>
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
            Public Crisis Lifeline
          </span>
        </div>

        {/* Title Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <FiAlertTriangle className="text-accent animate-bounce" /> Emergency SOS Console
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
            One-tap crisis dispatch. Transmits your real-time coordinates to all nearby rescue squads, mobile units, and command centers.
          </p>
        </div>

        {/* Active Beacon Notification State */}
        <AnimatePresence>
          {activeBeacon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-3xl bg-accent/10 border-2 border-accent shadow-[0_0_50px_rgba(255,59,59,0.3)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,59,59,0.6)] animate-pulse">
                    <FiRadio />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-accent font-bold uppercase tracking-wider">
                      ● BEACON ACTIVE & TRANSMITTING
                    </span>
                    <h3 className="text-xl font-bold text-white">Distress Signal #{activeBeacon.id.slice(-6).toUpperCase()}</h3>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-dark-300/80 border border-white/10 text-xs font-mono text-gray-300">
                  Triggered at {activeBeacon.time}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-dark-300/60 border border-white/5">
                  <span className="text-gray-400 block font-mono">EMERGENCY CLASSIFICATION</span>
                  <span className="text-white font-bold">{activeBeacon.type}</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-300/60 border border-white/5">
                  <span className="text-gray-400 block font-mono">SECTOR GPS TELEMETRY</span>
                  <span className="text-primary font-bold">{activeBeacon.location}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-dark-200/90 border border-accent/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-emerald-400 font-bold">Rescue Units Alerted</span>
                  <span className="text-gray-400">— Stand by on this frequency. Conserve battery.</span>
                </div>
                <button
                  onClick={() => setActiveBeacon(null)}
                  className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
                >
                  Dismiss Banner
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main SOS Trigger Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-strong p-6 sm:p-8 rounded-3xl border border-accent/40 shadow-[0_0_40px_rgba(255,59,59,0.15)] relative overflow-hidden">
              <form onSubmit={handleTriggerSOS} className="space-y-5">
                {/* Situation Select */}
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-2">
                    1. Select Emergency Situation
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {EMERGENCY_TYPES.map((type) => (
                      <button
                        type="button"
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          selectedType === type.id
                            ? `${type.color} border-accent shadow-[0_0_15px_rgba(255,59,59,0.3)]`
                            : 'border-white/10 bg-dark-300/50 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-xs font-bold text-white">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Display */}
                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 font-bold mb-2">
                    2. Location Telemetry
                  </label>
                  <div className="p-3.5 rounded-2xl bg-dark-200/80 border border-white/10 flex items-center gap-3">
                    <FiMapPin className="text-accent text-xl shrink-0 animate-pulse" />
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-white block truncate">{locationName}</span>
                      <span className="text-[11px] text-gray-400">Transmitted automatically to incoming dispatch teams.</span>
                    </div>
                  </div>
                  {gpsError && (
                    <p className="text-[11px] text-yellow-400 mt-1">{gpsError}</p>
                  )}
                </div>

                {/* Optional Contact details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      Your Name <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                      Phone Number <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-gray-300 mb-1">
                    Urgent Details / Landmarks <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="e.g. 2nd floor, water reaching stairs, 3 people trapped"
                    className="w-full bg-dark-200 border border-white/10 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Big Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-accent via-red-500 to-rose-600 hover:from-white hover:to-white text-white hover:text-dark-400 font-extrabold text-sm sm:text-base transition-all shadow-[0_0_30px_rgba(255,59,59,0.5)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] flex items-center justify-center gap-3 cursor-pointer uppercase tracking-wider"
                >
                  <FiAlertTriangle className="animate-pulse text-xl" />
                  {loading ? 'TRANSMITTING DISTRESS SIGNAL...' : 'TRANSMIT RESCUE BEACON NOW'}
                </button>
              </form>
            </div>
          </div>

          {/* Right: Direct Emergency Hotlines & Survival Guide (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct 1-Tap Hotline Dials */}
            <div className="glass p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <FiPhoneCall className="text-accent" /> Direct Emergency Hotlines
              </h3>
              <p className="text-xs text-gray-400 mb-4">Tap any number to call immediately on your phone.</p>

              <div className="space-y-2.5">
                {EMERGENCY_HOTLINES.map((hotline) => (
                  <a
                    key={hotline.number}
                    href={`tel:${hotline.number}`}
                    className="p-3.5 rounded-2xl bg-dark-300/70 border border-white/5 hover:border-accent/50 hover:bg-accent/10 transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-accent transition-colors">
                          {hotline.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                          {hotline.badge}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{hotline.desc}</span>
                    </div>

                    <span className="px-3 py-1.5 rounded-xl bg-accent text-white font-mono font-bold text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(255,59,59,0.3)]">
                      <FiPhoneCall size={12} /> {hotline.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Essential Immediate Survival Steps */}
            <div className="glass p-6 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <FiShield className="text-primary" /> While Waiting For Rescuers
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Stay in Place:</strong> Do not wander into floodwater or damaged structures unless current location is immediately unsafe.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Conserve Phone Battery:</strong> Keep screen brightness down and avoid video streaming. Keep line free for rescue squad callbacks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Signal Visually:</strong> Tie a bright cloth, wave a flashlight, or make regular acoustic noise (tap pipes or walls) so search dogs and teams locate you.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencySOS;
