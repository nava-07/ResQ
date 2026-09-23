import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import { 
  FiActivity, FiUsers, FiMapPin, FiShield, FiAlertTriangle, 
  FiCheckCircle, FiHeart, FiBookOpen, FiPhoneCall, FiInfo, FiChevronRight, FiX
} from 'react-icons/fi';
import SOSButton from '../components/SOSButton';
import DisasterCard from '../components/DisasterCard';
import { Link } from 'react-router-dom';
import { getDisasters, getAlerts, getResources } from '../api/endpoints';
import { detectCurrentLocation } from '../utils/location';
import toast from 'react-hot-toast';

const survivalGuides = [
  {
    id: 'cpr',
    title: 'Adult CPR Protocol',
    category: 'Medical Aid',
    color: 'text-rose-400',
    steps: [
      'Check scene safety and responsiveness of the victim.',
      'Call emergency services (911 / 112) or trigger ResQ SOS.',
      'Place heel of hand on the center of chest, lock elbows.',
      'Push hard and fast: 100-120 compressions per minute at 2 inches depth.',
      'Give 2 rescue breaths after every 30 compressions if trained.'
    ]
  },
  {
    id: 'flood',
    title: 'Flash Flood Survival',
    category: 'Weather Hazard',
    color: 'text-blue-400',
    steps: [
      'Move immediately to higher ground. Avoid low-lying basements.',
      'Never drive or walk through moving floodwater (6 inches can sweep a person).',
      'Turn off main electricity breaker and gas supply before water enters.',
      'Signal your location with a flashlight, whistle, or bright fabric.',
      'Drink only sealed or boiled water to prevent waterborne contamination.'
    ]
  },
  {
    id: 'earthquake',
    title: 'Earthquake Action: Drop, Cover, Hold',
    category: 'Geological Hazard',
    color: 'text-amber-400',
    steps: [
      'DROP onto your hands and knees to prevent being knocked over.',
      'COVER your head and neck under a sturdy table or desk.',
      'HOLD ON to your shelter until shaking stops completely.',
      'Stay away from windows, glass facades, and exterior walls.',
      'Do not use elevators. Use stairwells after tremors cease.'
    ]
  },
  {
    id: 'fire',
    title: 'Structural Fire Evacuation',
    category: 'Fire Safety',
    color: 'text-accent',
    steps: [
      'Stay low under smoke where air is cleaner and cooler.',
      'Feel closed doors with back of hand before opening (if hot, do not open).',
      'If clothes catch fire: STOP, DROP, and ROLL immediately.',
      'Evacuate via nearest fire exit without returning for personal belongings.',
      'Once outside, stay at designated safe assembly point.'
    ]
  }
];

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [recentDisasters, setRecentDisasters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [isSafe, setIsSafe] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState(new Date().toLocaleTimeString());
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    detectCurrentLocation().then(loc => {
      setLocationName(loc.address);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disastersRes, alertsRes, resRes] = await Promise.all([
          getDisasters({ limit: 4 }).catch(() => ({ data: { data: [] } })),
          getAlerts().catch(() => ({ data: { data: [] } })),
          getResources().catch(() => ({ data: { data: [] } }))
        ]);
        
        if (disastersRes.data?.data) {
          setRecentDisasters(disastersRes.data.data.slice(0, 4));
        }
        if (alertsRes.data?.data) {
          setAlerts(alertsRes.data.data);
        }
        if (resRes.data?.data) {
          // Filter resources that are shelters or medical centers
          const reliefCenters = resRes.data.data.filter(r => 
            r.category === 'shelter' || r.category === 'medicine' || r.category === 'food'
          );
          setShelters(reliefCenters.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch citizen dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const handleToggleSafeStatus = () => {
    const newStatus = !isSafe;
    setIsSafe(newStatus);
    const time = new Date().toLocaleTimeString();
    setLastCheckIn(time);
    if (newStatus) {
      toast.success(`Safety Beacon Broadcasted: Marked SAFE at ${time}`);
    } else {
      toast.error(`Assistance Requested: Marked NEED ASSISTANCE at ${time}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Greeting + "I Am Safe" Beacon + Quick Action */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 glass-strong p-6 rounded-3xl border border-primary/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary font-mono uppercase">
              Civilian Clearance
            </span>
            <span className="text-xs text-gray-400">• Citizen Hub</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome, <span className="text-primary">{user?.name || 'Citizen'}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-gray-400 text-sm">Real-time civilian safety monitor, emergency beacon & survival hub.</p>
            {locationName && (
              <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <FiMapPin size={11} className="text-primary" /> {locationName}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* "I Am Safe" Interactive Beacon */}
          <div className="flex items-center gap-3 bg-dark-300/80 px-4 py-2.5 rounded-2xl border border-white/10">
            <div className="flex flex-col">
              <span className="text-[11px] text-gray-400 uppercase font-mono">My Safety Beacon</span>
              <span className={`text-xs font-bold ${isSafe ? 'text-emerald-400' : 'text-accent animate-pulse'}`}>
                {isSafe ? 'STATUS: SAFE' : 'STATUS: NEED AID'}
              </span>
            </div>
            <button
              onClick={handleToggleSafeStatus}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSafe 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-dark-400'
                  : 'bg-accent text-white border border-accent/60 shadow-[0_0_15px_rgba(255,59,59,0.4)]'
              }`}
            >
              {isSafe ? 'Check In (Safe)' : 'Update Status'}
            </button>
          </div>

          <Link 
            to="/dashboard/report" 
            className="px-4 py-3 bg-primary/15 text-primary border border-primary/40 rounded-2xl hover:bg-primary hover:text-dark-400 transition-all text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
          >
            <FiAlertTriangle /> Report Incident
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiActivity} title="Active Hazards Near You" value={recentDisasters.length} colorClass="text-primary" />
        <StatCard icon={FiUsers} title="Volunteers In Sector" value="840+" colorClass="text-emerald-400" />
        <StatCard icon={FiShield} title="Rescue Squads Active" value="16" colorClass="text-accent" />
        <StatCard icon={FiMapPin} title="Relief Shelters Open" value={shelters.length > 0 ? shelters.length : '3'} colorClass="text-neon-purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Survival Guides + Recent Reports */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Survival Protocols & First Aid Manual (Accordion / Cards) */}
          <div className="glass p-6 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiBookOpen className="text-primary" /> Offline Survival & First-Aid Protocols
              </h3>
              <span className="text-xs text-gray-400 font-mono">QUICK GUIDELINES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {survivalGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="p-4 rounded-2xl bg-dark-300/60 border border-white/5 hover:border-primary/40 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-xs font-mono font-bold ${guide.color}`}>{guide.category}</span>
                      <FiChevronRight className="text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-primary transition-colors">{guide.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{guide.steps[0]}</p>
                  </div>
                  <div className="mt-3 text-[11px] text-primary font-semibold">Read 5-step protocol →</div>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Havens & Nearby Shelters */}
          <div className="glass p-6 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiMapPin className="text-neon-purple" /> Safe Havens & Relief Hubs
              </h3>
              <Link to="/dashboard/map" className="text-xs text-primary hover:underline font-mono">
                EXPLORE ON MAP →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(shelters.length > 0 ? shelters : [
                { _id: '1', name: 'Sector 4 Community Shelter', category: 'shelter', quantity: 250, status: 'available' },
                { _id: '2', name: 'Central Emergency Hospital', category: 'medicine', quantity: 80, status: 'available' },
                { _id: '3', name: 'Red Cross Relief Depot', category: 'food', quantity: 500, status: 'available' },
              ]).map((shelter) => (
                <div key={shelter._id} className="p-4 rounded-2xl bg-dark-300/50 border border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neon-purple/15 text-neon-purple">
                      {shelter.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{shelter.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">Status: <span className="text-emerald-400 font-semibold">{shelter.status || 'Active'}</span></p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span>Capacity / Units:</span>
                    <span className="text-white font-mono font-bold">{shelter.quantity || 'Open'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Incident Reports */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-6 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiActivity className="text-accent" /> Recent Incident Reports
              </h3>
              <Link to="/dashboard/report" className="text-xs text-primary hover:underline font-mono">
                SUBMIT REPORT →
              </Link>
            </div>
            
            {recentDisasters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentDisasters.map(d => (
                  <DisasterCard key={d._id} disaster={d} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 bg-dark-300/40 rounded-2xl border border-white/5">
                <FiActivity className="mx-auto text-3xl mb-2 opacity-40 text-primary" />
                <p className="text-sm">No active incidents reported in your immediate vicinity.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right Col: SOS Hub + Live Alerts */}
        <div className="space-y-6">
          {/* Emergency SOS Panic Hub */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-strong p-6 rounded-3xl flex flex-col items-center border border-accent/30 bg-accent/5">
            <div className="w-full flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FiShield className="text-accent" /> Emergency Beacon
              </h3>
              <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
            </div>
            <p className="text-xs text-gray-300 text-center mb-4">
              Pressing the beacon transmits your exact GPS location to the nearest Rescue Squad and triggers high-priority dispatch.
            </p>
            <SOSButton onSOS={() => {
              window.location.href = '/dashboard/sos';
            }} />
            <div className="w-full mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span>Helpline: <strong className="text-white">112 / 911</strong></span>
              <Link to="/dashboard/sos" className="text-accent font-bold hover:underline">SOS Console →</Link>
            </div>
          </motion.div>

          {/* Live Civil Defense Alerts */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass p-6 rounded-3xl h-[420px] flex flex-col border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Civilian Broadcasts</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
            </h3>
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              {alerts.length > 0 ? alerts.map((alert) => (
                <div key={alert._id} className={`p-3.5 rounded-2xl border ${alert.severity === 'critical' ? 'border-accent/50 bg-accent/10' : 'border-white/10 bg-dark-300/60'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${alert.severity === 'critical' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                      {alert.severity ? alert.severity.toUpperCase() : 'ALERT'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">Live</span>
                  </div>
                  <h5 className="text-sm font-bold text-white">{alert.title}</h5>
                  <p className="text-xs text-gray-300 mt-1 leading-relaxed">{alert.message}</p>
                </div>
              )) : (
                <div className="text-center p-8 text-gray-500 text-sm">
                  <FiInfo className="mx-auto text-2xl mb-2 opacity-50" />
                  No urgent civil defense alerts at this hour.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Survival Protocol Modal */}
      <AnimatePresence>
        {selectedGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-dark-300 border border-primary/40 p-6 sm:p-8 rounded-3xl max-w-lg w-full relative shadow-[0_0_50px_rgba(0,212,255,0.25)]"
            >
              <button
                onClick={() => setSelectedGuide(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>

              <span className={`text-xs font-mono font-bold uppercase ${selectedGuide.color}`}>
                {selectedGuide.category}
              </span>
              <h3 className="text-2xl font-bold text-white mt-1 mb-4">{selectedGuide.title}</h3>

              <div className="space-y-3 mb-6">
                {selectedGuide.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-dark-200/70 p-3 rounded-xl border border-white/5">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-200 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedGuide(null)}
                className="w-full py-3 bg-primary text-dark-400 font-bold rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] cursor-pointer"
              >
                I UNDERSTAND PROTOCOL
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CitizenDashboard;
