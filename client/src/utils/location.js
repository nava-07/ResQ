/**
 * Auto Location Detection & Reverse Geocoding Utility for ResQ Platform
 */

// Reverse geocode latitude and longitude into a readable address using OpenStreetMap Nominatim
export const reverseGeocode = async (lat, lng) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'en' }
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.display_name) {
        // Construct a clean, concise address (Sub-district, City/Town, State, Country)
        const addr = data.address || {};
        const road = addr.road || addr.suburb || addr.neighbourhood || '';
        const city = addr.city || addr.town || addr.village || addr.county || '';
        const state = addr.state || '';
        const country = addr.country || '';
        
        const parts = [road, city, state, country].filter(Boolean);
        if (parts.length > 0) {
          return parts.join(', ');
        }
        return data.display_name;
      }
    }
  } catch (err) {
    // Network or timeout, fallback to coordinate string
  }
  return `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
};

// Fallback to IP-based location if device GPS is denied or unavailable
export const getIPLocation = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          lat: data.latitude,
          lng: data.longitude,
          coordinates: [data.longitude, data.latitude],
          address: `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`.replace(/^, /, ''),
          source: 'ip',
          accuracy: 5000
        };
      }
    }
  } catch (e) {
    // IP location failed
  }
  return null;
};

// Main Auto Location Detector
export const detectCurrentLocation = async (options = {}) => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      getIPLocation().then((ipLoc) => {
        if (ipLoc) return resolve(ipLoc);
        resolve({
          lat: 20.5937,
          lng: 78.9629,
          coordinates: [78.9629, 20.5937],
          address: 'India (Default Sector)',
          source: 'default',
          accuracy: null
        });
      });
      return;
    }

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: options.timeout || 7000,
      maximumAge: options.maximumAge || 30000
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);

        const address = await reverseGeocode(lat, lng);

        resolve({
          lat,
          lng,
          coordinates: [lng, lat],
          address,
          accuracy,
          source: 'gps'
        });
      },
      async (err) => {
        console.warn('GPS detection failed, falling back to IP location:', err.message);
        const ipLoc = await getIPLocation();
        if (ipLoc) {
          return resolve(ipLoc);
        }
        resolve({
          lat: 20.5937,
          lng: 78.9629,
          coordinates: [78.9629, 20.5937],
          address: 'India Sector (GPS Unavailable)',
          source: 'fallback',
          accuracy: null
        });
      },
      geoOptions
    );
  });
};
