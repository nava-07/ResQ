import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SOSButton from '../components/SOSButton';
import { FiCheckCircle, FiClock, FiActivity, FiMapPin, FiCompass, FiAlertTriangle } from 'react-icons/fi';
import { createSOS, getMySOS } from '../api/endpoints';
import { detectCurrentLocation } from '../utils/location';
import toast from 'react-hot-toast';

const SOSPage = () => {
  const [sosHistory, setSosHistory] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [detecting, setDetecting] = useState(true);

  const fetchSOSHistory = async () => {
    try {
      const res = await getMySOS();
      if (res.data?.data) {
        setSosHistory(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch SOS history", err);
    }
  };

  useEffect(() => {
    fetchSOSHistory();

    // Auto-detect location on mount
    detectCurrentLocation().then(loc => {
      setCurrentLocation(loc);
      setDetecting(false);
    }).catch(() => {
      setDetecting(false);
    });
  }, []);

  const handleSOS = async (locData) => {
    const loc = locData || currentLocation || {
      coordinates: [78.9629, 20.5937],
      address: 'GPS Telemetry Point'
    };

    try {
      const payload = {
        message: 'CRITICAL EMERGENCY: Civilian Panic Distress Signal',
        priority: 'critical',
        location: {
          type: 'Point',
          coordinates: loc.coordinates,
          address: loc.address
        }
      };

      await createSOS(payload);
      toast.success('🚨 SOS Dispatched! Tactical rescue squads and nearby volunteers alerted.');
      fetchSOSHistory();
    } catch (err) {
      console.error('Failed to broadcast SOS:', err);
      toast.error('Failed to transmit SOS signal');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight flex items-center justify-center gap-3">
          <FiAlertTriangle className="text-accent animate-pulse" /> Emergency SOS Lifeline
        </h1>
        <p className="text-gray-400 text-sm">Automatic GPS telemetry lock ensures rescue units locate you immediately.</p>
      </div>

      {/* Auto Location Status Card */}
      <div className="glass p-4 rounded-2xl border border-accent/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <FiCompass className={detecting ? 'animate-spin' : ''} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-accent uppercase font-bold tracking-wider">
              AUTO-LOCATION TELEMETRY
            </span>
            <h4 className="text-sm font-bold text-white">
              {detecting ? 'Detecting satellite GPS coordinates...' : currentLocation?.address || 'Coordinates Locked'}
            </h4>
          </div>
        </div>

        {currentLocation && (
          <div className="text-xs font-mono text-gray-400 bg-dark-300/70 px-3 py-1.5 rounded-xl border border-white/5">
            {currentLocation.lat.toFixed(4)}° N, {currentLocation.lng.toFixed(4)}° E
          </div>
        )}
      </div>

      {/* Big Panic Beacon Button Card */}
      <div className="glass-strong p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center border-accent/40 shadow-[0_0_50px_rgba(255,59,59,0.15)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsNTksNTksMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50 z-0"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center">
          <SOSButton onSOS={handleSOS} />
          
          <div className="mt-8 text-center max-w-md">
            <h3 className="text-lg font-bold text-accent mb-1 tracking-wider uppercase">Auto-GPS Instant Broadcast</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tapping the SOS beacon automatically detects your device coordinates and sends high-priority distress telemetry to all active rescue units.
            </p>
          </div>
        </div>
      </div>

      {/* Signal History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-3xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-white">Your SOS Distress Signals</h3>
          <span className="text-xs text-gray-400 font-mono">{sosHistory.length} TRANSMISSIONS</span>
        </div>
        
        <div className="space-y-3">
          {sosHistory.length > 0 ? sosHistory.map((item) => (
            <div key={item._id} className="bg-dark-300/50 rounded-2xl p-4 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.status === 'pending' || item.status === 'accepted' ? 'bg-accent/20 text-accent animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {item.status === 'pending' || item.status === 'accepted' ? <FiActivity /> : <FiCheckCircle />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm uppercase">{item.message || 'Distress Beacon'}</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 font-mono">
                    <FiClock /> {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end gap-1 text-xs">
                <span className={`px-3 py-1 rounded-full font-mono font-bold uppercase border self-start md:self-end ${
                  item.status === 'pending' ? 'border-accent/50 text-accent bg-accent/10' :
                  item.status === 'rescued' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' :
                  'border-yellow-500/50 text-yellow-400 bg-yellow-500/10'
                }`}>
                  {item.status?.replace('_', ' ')}
                </span>
                <span className="text-gray-400 font-mono flex items-center gap-1 truncate max-w-xs">
                  <FiMapPin className="text-accent" /> {item.location?.address || 'GPS Coordinates Locked'}
                </span>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500 text-sm bg-dark-300/30 rounded-2xl border border-white/5">
              <FiCheckCircle className="mx-auto text-3xl mb-2 text-emerald-400 opacity-50" />
              No emergency distress transmissions logged on your account.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SOSPage;
