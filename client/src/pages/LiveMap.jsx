import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  FiActivity, FiUsers, FiPlusSquare, FiHome, 
  FiCrosshair, FiSearch, FiExternalLink, FiLayers, FiNavigation 
} from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import { getDisasters, getVolunteers, getResources, getAllSOS } from '../api/endpoints';
import { useSocket } from '../context/SocketContext';
import { detectCurrentLocation } from '../utils/location';
import toast from 'react-hot-toast';

// Fix Leaflet default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Map Tile Providers (Google Maps with subdomains + CartoDB Tactical Dark + OSM fallback)
const TILE_LAYERS = {
  googleHybrid: {
    id: 'googleHybrid',
    name: 'Google Satellite',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Satellite'
  },
  googleStreets: {
    id: 'googleStreets',
    name: 'Google Streets',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Road Network'
  },
  googleTerrain: {
    id: 'googleTerrain',
    name: 'Google Terrain',
    url: 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Terrain'
  },
  darkMatter: {
    id: 'darkMatter',
    name: 'Tactical Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
    attribution: '&copy; CartoDB Dark Matter'
  },
  osm: {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }
};

const createCustomIcon = (color, pulseColor) => {
  return new L.DivIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: ${pulseColor || color}; opacity: 0.4; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${color}; border: 2.5px solid white; box-shadow: 0 0 12px ${color}; z-index: 2;"></div>
    </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

const userIcon = new L.DivIcon({
  className: 'custom-user-pin',
  html: `<div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
    <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: rgba(0, 212, 255, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
    <div style="width: 16px; height: 16px; border-radius: 50%; background: #00d4ff; border: 2.5px solid white; box-shadow: 0 0 16px #00d4ff;"></div>
  </div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

const searchIcon = new L.DivIcon({
  className: 'custom-search-pin',
  html: `<div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
    <div style="width: 16px; height: 16px; border-radius: 50%; background: #f59e0b; border: 2.5px solid white; box-shadow: 0 0 15px #f59e0b;"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const icons = {
  disaster: createCustomIcon('rgb(255 59 59)', 'rgba(255, 59, 59, 0.4)'),
  sos: createCustomIcon('rgb(239 68 68)', 'rgba(239, 68, 68, 0.6)'),
  volunteer: createCustomIcon('rgb(34 197 94)', 'rgba(34, 197, 94, 0.4)'),
  hospital: createCustomIcon('rgb(0 212 255)', 'rgba(0, 212, 255, 0.4)'),
  shelter: createCustomIcon('rgb(168 85 247)', 'rgba(168, 85, 247, 0.4)')
};

// Component to handle dynamic flying and ensure Leaflet recalculates dimensions
const MapController = ({ target, zoom = 14 }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size to prevent gray tiles or container collapse issues
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (target && target[0] && target[1]) {
      map.flyTo(target, zoom, { duration: 1.5 });
    }
  }, [target, zoom, map]);

  return null;
};

const LiveMap = () => {
  const socket = useSocket();
  const [data, setData] = useState({
    disasters: [],
    volunteers: [],
    hospitals: [],
    shelters: []
  });

  const [activeLayer, setActiveLayer] = useState('googleHybrid');
  const [userLoc, setUserLoc] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [flyTarget, setFlyTarget] = useState(null);

  // Google Maps Place Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const [filters, setFilters] = useState({
    disasters: true,
    volunteers: true,
    hospitals: true,
    shelters: true
  });

  const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));

  // Auto-detect user GPS on mount
  useEffect(() => {
    detectCurrentLocation()
      .then(loc => {
        setUserLoc([loc.lat, loc.lng]);
        setUserAddress(loc.address);
        setFlyTarget([loc.lat, loc.lng]);
        toast.success(`Map centered on: ${loc.address}`, { id: 'map-init' });
      })
      .catch(err => {
        console.warn("Auto-location failed:", err);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [disRes, volRes, resRes, sosRes] = await Promise.all([
          getDisasters(),
          getVolunteers(),
          getResources(),
          getAllSOS().catch(() => ({ data: { data: [] } }))
        ]);
        
        let disasters = disRes.data?.data || [];
        const sosRequests = sosRes.data?.data || [];
        
        // Merge pending SOS requests into disasters
        sosRequests.forEach(sos => {
          if (sos.status !== 'closed' && sos.status !== 'rescued') {
            disasters.push({
              _id: sos._id,
              type: 'Emergency SOS',
              severity: sos.priority === 'critical' ? 'critical' : 'high',
              location: sos.location,
              message: sos.message,
              isSOS: true
            });
          }
        });

        const volunteers = volRes.data?.data || [];
        const resources = resRes.data?.data || [];

        const hospitals = resources.filter(r => r.category === 'medicine' || r.category === 'blood');
        const shelters = resources.filter(r => r.category === 'shelter' || r.category === 'food' || r.category === 'water');

        setData({ disasters, volunteers, hospitals, shelters });
      } catch (err) {
        console.error("Failed to fetch map telemetry data", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    socket.on('new-alert', (alert) => {
      toast.error(`ALERT: ${alert.title}`);
    });
    
    socket.on('rescue-update', () => {
      toast.success("Rescue squad status update received");
    });
    
    socket.on('sos-alert', (disaster) => {
      if (disaster) {
        toast('New Emergency SOS Broadcast!', { icon: '🚨' });
        setData(prev => ({ ...prev, disasters: [...prev.disasters, disaster] }));
      }
    });

    return () => {
      socket.off('new-alert');
      socket.off('rescue-update');
      socket.off('sos-alert');
    };
  }, [socket]);

  // Extract Lat/Lng helper
  const getPos = (location) => {
    if (location && location.coordinates && location.coordinates.length === 2) {
      return [location.coordinates[1], location.coordinates[0]]; // [lat, lng]
    }
    return null;
  };

  // Google Maps Search / Nominatim geocoding
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    toast.loading(`Searching location "${searchQuery}"...`, { id: 'search-loc' });

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1&addressdetails=1`
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const item = results[0];
          const lat = parseFloat(item.lat);
          const lng = parseFloat(item.lon);
          const pos = [lat, lng];

          setSearchResult({
            pos,
            name: item.display_name,
            shortName: searchQuery
          });
          setFlyTarget(pos);
          toast.success(`Found: ${item.display_name.slice(0, 45)}...`, { id: 'search-loc' });
        } else {
          toast.error('Location not found. Please try another place.', { id: 'search-loc' });
        }
      }
    } catch (err) {
      toast.error('Search request failed', { id: 'search-loc' });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRecenterMe = () => {
    if (userLoc) {
      setFlyTarget([...userLoc]);
      toast.success('Centered to your GPS location');
    } else {
      detectCurrentLocation().then(loc => {
        setUserLoc([loc.lat, loc.lng]);
        setUserAddress(loc.address);
        setFlyTarget([loc.lat, loc.lng]);
      });
    }
  };

  const currentLayer = TILE_LAYERS[activeLayer] || TILE_LAYERS.googleHybrid;

  return (
    <div className="w-full h-[calc(100vh-8rem)] min-h-[600px] relative flex flex-col rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
      
      {/* Top Controls: Google Search + Layer Switcher + Auto-GPS */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pointer-events-none">
        
        {/* Google Location Search Box */}
        <form onSubmit={handleSearch} className="pointer-events-auto flex items-center gap-2 glass-strong p-1.5 rounded-2xl border border-white/15 shadow-2xl max-w-md w-full">
          <FiSearch className="text-primary text-lg ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search place, city, or disaster zone..."
            className="w-full bg-transparent border-none text-white text-xs px-2 py-1.5 focus:outline-none placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-3 py-1.5 rounded-xl bg-primary text-dark-400 text-xs font-bold hover:bg-white transition-all shrink-0 cursor-pointer shadow-[0_0_10px_rgba(0,212,255,0.3)]"
          >
            {isSearching ? 'Finding...' : 'Search'}
          </button>
        </form>

        {/* Right Controls: Layer Switcher & Auto-GPS */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          
          {/* Layer Switcher */}
          <div className="glass-strong p-1.5 rounded-2xl border border-white/15 flex items-center gap-1 shadow-2xl">
            <FiLayers className="text-primary text-sm mx-1.5" />
            {Object.keys(TILE_LAYERS).map((key) => {
              const layer = TILE_LAYERS[key];
              const isActive = activeLayer === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveLayer(key);
                    toast.success(`Switched layer to ${layer.name}`);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-dark-400 shadow-[0_0_12px_rgba(0,212,255,0.4)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {layer.name}
                </button>
              );
            })}
          </div>

          {/* Recenter GPS Button */}
          <button
            onClick={handleRecenterMe}
            className="glass-strong px-3 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white border border-primary/40 hover:bg-primary/20 transition-all shadow-[0_0_15px_rgba(0,212,255,0.3)] cursor-pointer"
          >
            <FiCrosshair className="text-sm" />
            <span>My GPS</span>
          </button>
        </div>
      </div>

      {/* Floating Filter Tags (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-[1000] glass-strong p-2.5 rounded-2xl border border-white/15 flex flex-wrap items-center gap-2 pointer-events-auto shadow-2xl">
        <span className="text-[10px] font-mono text-gray-400 uppercase font-bold px-1.5">FILTERS:</span>
        <button onClick={() => toggleFilter('disasters')} className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${filters.disasters ? 'bg-accent/20 text-accent border border-accent/50 shadow-[0_0_10px_rgba(255,59,59,0.3)]' : 'bg-dark-300 text-gray-500'}`}>
          <FiActivity className="inline mr-1"/> Incidents ({data.disasters.length})
        </button>
        <button onClick={() => toggleFilter('volunteers')} className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${filters.volunteers ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-dark-300 text-gray-500'}`}>
          <FiUsers className="inline mr-1"/> Responders ({data.volunteers.length})
        </button>
        <button onClick={() => toggleFilter('hospitals')} className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${filters.hospitals ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-dark-300 text-gray-500'}`}>
          <FiPlusSquare className="inline mr-1"/> Medical ({data.hospitals.length})
        </button>
        <button onClick={() => toggleFilter('shelters')} className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${filters.shelters ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/50' : 'bg-dark-300 text-gray-500'}`}>
          <FiHome className="inline mr-1"/> Shelters ({data.shelters.length})
        </button>
      </div>

      {/* Map Container */}
      <MapContainer 
        center={userLoc || [20.5937, 78.9629]} 
        zoom={userLoc ? 13 : 5} 
        style={{ height: '100%', minHeight: '600px', width: '100%', background: '#0a0d14' }}
        zoomControl={false}
      >
        <TileLayer
          key={currentLayer.id}
          url={currentLayer.url}
          subdomains={currentLayer.subdomains}
          attribution={currentLayer.attribution}
          maxZoom={currentLayer.maxZoom}
        />

        <MapController target={flyTarget} zoom={14} />

        {/* Auto-detected User GPS Marker */}
        {userLoc && (
          <Marker position={userLoc} icon={userIcon}>
            <Popup className="custom-popup">
              <div className="bg-dark-300 p-3 rounded-xl text-white space-y-2 min-w-[220px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
                    ● YOUR AUTO-DETECTED GPS
                  </span>
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                </div>
                <h4 className="font-bold text-white text-sm">{userAddress || 'Current Location'}</h4>
                <p className="text-[11px] text-gray-400 font-mono">{userLoc[0].toFixed(5)}° N, {userLoc[1].toFixed(5)}° E</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${userLoc[0]},${userLoc[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 w-full py-1.5 bg-primary/15 hover:bg-primary text-primary hover:text-dark-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <FiExternalLink /> Open in Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Searched Location Pin */}
        {searchResult && (
          <Marker position={searchResult.pos} icon={searchIcon}>
            <Popup className="custom-popup">
              <div className="bg-dark-300 p-3 rounded-xl text-white space-y-2 min-w-[220px]">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  🔍 GOOGLE SEARCH RESULT
                </span>
                <h4 className="font-bold text-white text-sm">{searchResult.name}</h4>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${searchResult.pos[0]},${searchResult.pos[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-1.5 bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-dark-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <FiExternalLink /> Navigate with Google Maps
                </a>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Disaster & SOS Markers with Direct Google Maps Link */}
        {filters.disasters && data.disasters.map((d, idx) => {
          const pos = getPos(d.location);
          if (!pos) return null;
          return (
            <Marker key={`d-${d._id || idx}`} position={pos} icon={d.isSOS ? icons.sos : icons.disaster}>
              <Popup className="custom-popup">
                <div className="bg-dark-300 p-3 rounded-xl text-white space-y-2 min-w-[220px]">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${d.isSOS ? 'bg-accent/20 text-accent' : 'bg-accent/20 text-accent'}`}>
                      {d.isSOS ? '🚨 CRITICAL SOS BEACON' : `${d.type?.toUpperCase()} HAZARD`}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{d.location?.address || d.message || d.type}</h4>
                  <p className="text-xs text-gray-400 font-mono">Coords: {pos[0].toFixed(4)}°, {pos[1].toFixed(4)}°</p>
                  
                  {/* Google Maps Actions */}
                  <div className="flex gap-1.5 pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${pos[0]},${pos[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1 transition-all"
                    >
                      <FiExternalLink size={11} /> Google Map
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${pos[0]},${pos[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 bg-accent hover:bg-white text-white hover:text-dark-400 text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1 transition-all shadow-[0_0_10px_rgba(255,59,59,0.3)]"
                    >
                      <FiNavigation size={11} /> Navigate
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Volunteers */}
        {filters.volunteers && data.volunteers.map((v, idx) => {
          if (!v.user?.location) return null;
          const pos = getPos(v.user.location);
          if (!pos) return null;
          return (
            <Marker key={`v-${v._id || idx}`} position={pos} icon={icons.volunteer}>
              <Popup className="custom-popup">
                <div className="bg-dark-300 p-3 rounded-xl text-white space-y-1.5 min-w-[200px]">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">● FIELD AGENT</span>
                  <h4 className="font-bold text-white text-sm">{v.user?.name}</h4>
                  <p className="text-xs text-gray-400">Skills: {v.skills?.join(', ') || 'Relief & First Aid'}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${pos[0]},${pos[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[11px] text-emerald-400 hover:underline font-mono"
                  >
                    View in Google Maps →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Hospitals */}
        {filters.hospitals && data.hospitals.map((h, idx) => {
          const pos = getPos(h.location);
          if (!pos) return null;
          return (
            <Marker key={`h-${h._id || idx}`} position={pos} icon={icons.hospital}>
              <Popup className="custom-popup">
                <div className="bg-dark-300 p-3 rounded-xl text-white space-y-1.5 min-w-[200px]">
                  <span className="text-[10px] font-mono text-primary font-bold uppercase">🏥 MEDICAL FACILITY</span>
                  <h4 className="font-bold text-white text-sm">{h.name}</h4>
                  <p className="text-xs text-gray-400">Stock / Units: {h.quantity}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${pos[0]},${pos[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[11px] text-primary hover:underline font-mono"
                  >
                    Directions via Google Maps →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Shelters */}
        {filters.shelters && data.shelters.map((s, idx) => {
          const pos = getPos(s.location);
          if (!pos) return null;
          return (
            <Marker key={`s-${s._id || idx}`} position={pos} icon={icons.shelter}>
              <Popup className="custom-popup">
                <div className="bg-dark-300 p-3 rounded-xl text-white space-y-1.5 min-w-[200px]">
                  <span className="text-[10px] font-mono text-neon-purple font-bold uppercase">🏕️ RELIEF SHELTER</span>
                  <h4 className="font-bold text-white text-sm">{s.name}</h4>
                  <p className="text-xs text-gray-400">Capacity: {s.quantity}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${pos[0]},${pos[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-[11px] text-neon-purple hover:underline font-mono"
                  >
                    Directions via Google Maps →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
