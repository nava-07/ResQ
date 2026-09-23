import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiMapPin, FiSend, FiRefreshCw, FiCheckCircle, FiCompass } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createDisaster } from '../api/endpoints';
import { detectCurrentLocation } from '../utils/location';

const ReportDisaster = () => {
  const [formData, setFormData] = useState({
    type: 'Flood',
    severity: 'Medium',
    description: '',
    locationString: '',
    coordinates: null
  });
  const [detectingLocation, setDetectingLocation] = useState(true);
  const [accuracyInfo, setAccuracyInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect location on mount
  const handleAutoDetectLocation = async (manualTrigger = false) => {
    setDetectingLocation(true);
    if (manualTrigger) toast.loading('Auto-detecting your location...', { id: 'gps-load' });

    try {
      const loc = await detectCurrentLocation();
      setFormData(prev => ({
        ...prev,
        coordinates: loc.coordinates,
        locationString: loc.address
      }));
      setAccuracyInfo({
        source: loc.source,
        accuracy: loc.accuracy,
        coordsText: `${loc.lat.toFixed(4)}°, ${loc.lng.toFixed(4)}°`
      });
      if (manualTrigger) toast.success(`Location locked: ${loc.address}`, { id: 'gps-load' });
    } catch (err) {
      if (manualTrigger) toast.error('Could not detect location', { id: 'gps-load' });
    } finally {
      setDetectingLocation(false);
    }
  };

  useEffect(() => {
    handleAutoDetectLocation(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coordinates) {
      toast.error('Please allow location detection or provide valid coordinates');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        type: formData.type.toLowerCase(),
        description: formData.description,
        severity: formData.severity.toLowerCase(),
        location: {
          type: 'Point',
          coordinates: formData.coordinates,
          address: formData.locationString || 'Auto-detected incident sector'
        }
      };
      
      await createDisaster(payload);
      toast.success('Disaster reported successfully! AI severity analysis triggered.');
      setFormData({
        type: 'Flood',
        severity: 'Medium',
        description: '',
        locationString: formData.locationString, // keep current location
        coordinates: formData.coordinates
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden border border-white/10"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-neon-purple"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Report Incident</h2>
            <p className="text-gray-400 text-sm mt-1">Automatic GPS location tagging helps dispatch responders directly to you.</p>
          </div>
          
          <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Auto-GPS Ready
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Disaster Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-dark-300 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm"
              >
                {['Flood', 'Earthquake', 'Fire', 'Cyclone', 'Accident', 'Landslide', 'Tsunami', 'Other'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Severity Level</label>
              <select 
                value={formData.severity}
                onChange={(e) => setFormData({...formData, severity: e.target.value})}
                className="w-full bg-dark-300 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm"
              >
                {['Low', 'Medium', 'High', 'Critical'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Automatic Location Detection Section */}
          <div className="p-4 rounded-2xl bg-dark-300/80 border border-primary/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                <FiCompass className="animate-spin text-sm" style={{ animationDuration: '6s' }} />
                Auto-Detected Location
              </label>
              <button
                type="button"
                onClick={() => handleAutoDetectLocation(true)}
                disabled={detectingLocation}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-white px-3 py-1 rounded-lg bg-primary/15 border border-primary/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <FiRefreshCw className={detectingLocation ? 'animate-spin' : ''} size={12} />
                {detectingLocation ? 'Locating...' : 'Refresh GPS'}
              </button>
            </div>

            <div className="relative">
              <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary" />
              <input 
                type="text"
                required
                value={formData.locationString}
                onChange={(e) => setFormData({...formData, locationString: e.target.value})}
                placeholder={detectingLocation ? 'Auto-detecting your location via GPS...' : 'Enter or adjust address...'}
                className="w-full bg-dark-200 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary text-sm"
              />
            </div>

            {accuracyInfo && (
              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-gray-400 pt-1">
                <span>Coordinates: <strong className="text-white">{accuracyInfo.coordsText}</strong></span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <FiCheckCircle size={12} />
                  {accuracyInfo.source === 'gps' ? `Device GPS (±${accuracyInfo.accuracy || 10}m)` : 'Cellular / IP'}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-2">Description & Casualties</label>
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what happened, water level, trapped persons, landmarks, urgent needs..."
              className="w-full bg-dark-300 border border-white/10 text-white rounded-xl p-4 focus:outline-none focus:border-primary resize-none text-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting || detectingLocation}
            className="w-full bg-primary hover:bg-white text-dark-400 font-extrabold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,212,255,0.4)] cursor-pointer text-sm uppercase tracking-wider"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-dark-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <><FiSend /> SUBMIT INCIDENT REPORT</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportDisaster;
