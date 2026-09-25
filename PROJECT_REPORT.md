# SRI SHAKTHI INSTITUTE OF ENGINEERING AND TECHNOLOGY
*(An Autonomous Institution | Approved by AICTE, Affiliated to Anna University | Accredited with 'A' Grade by NAAC)*  
**Coimbatore – 641062, Tamil Nadu**

---

# PROJECT REPORT

## **MERN PROJECT: ResQ – INTELLIGENT DISASTER RESPONSE & RESCUE PLATFORM**

**DOMAIN:** Full-Stack Web Development, Real-Time Distributed Systems, Cloud Computing & AI  
**DEVELOPER:** NAVANEETHAN S  
**TECH STACK:** MongoDB, Express.js, React.js (Vite), Node.js, Socket.IO, Tailwind CSS, Leaflet GIS  

---

## 1. ABSTRACT

**ResQ** is a production-grade, full-stack disaster management and real-time emergency coordination platform developed using the **MERN (MongoDB, Express.js, React.js, Node.js)** architecture. Conventional disaster management and emergency relief channels often suffer from severe communication bottlenecks, chaotic field coordination, and slow dispatch responses during natural or human-made catastrophes (floods, earthquakes, fires, cyclones). **ResQ** addresses these critical challenges by providing an automated, location-aware incident reporting pipeline, a zero-latency WebSocket emergency beacon network, and dedicated portals engineered for four distinct operational roles: **Citizens**, **Volunteers**, **Rescue Squads**, and **System Administrators**.

The platform incorporates automated browser GPS geolocation and reverse-geocoding via OpenStreetMap Nominatim, interactive multi-layer GIS mapping featuring **Google Satellite/Hybrid**, **Google Streets**, and **CartoDB Dark Matter** views, and instant routing integration with Google Maps. Citizens can report hazards and trigger one-tap critical SOS beacons with live geographical telemetry. Responders and rescue teams receive real-time situational broadcasts via **Socket.IO**, assign specialized squads, triage incidents by severity, manage vital supplies (medical units, blood banks, shelter capacity, lifeboats), and initiate turn-by-turn navigation directly to victims in need. An AI severity assessment engine evaluates reports to prioritize resource dispatching. By combining a futuristic Apple/Tesla-inspired dark glassmorphism interface, robust REST APIs, high-concurrency WebSocket channels, and geospatial indexing, ResQ delivers an end-to-end mission-critical disaster management system.

---

## 2. TECH STACK & SYSTEM ARCHITECTURE

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT LAYER                                       |
|  React 18 (Vite) | Tailwind CSS | Framer Motion | React-Leaflet | Socket.IO Client    |
+------------------------------------------+--------------------------------------------+
                                           |
                                [HTTPS / WSS Protocols]
                                           |
+------------------------------------------v--------------------------------------------+
|                                  APPLICATION LAYER                                    |
|         Node.js & Express.js REST API Server | Socket.IO Bidirectional Gateway         |
|   Role-Based Access Control (RBAC) | JWT Authentication | Cloudinary Media Storage    |
+------------------------------------------+--------------------------------------------+
                                           |
                                [Mongoose ODM Driver]
                                           |
+------------------------------------------v--------------------------------------------+
|                                   DATABASE LAYER                                      |
|            MongoDB NoSQL Database | 2dsphere Geospatial Coordinate Indexing           |
+---------------------------------------------------------------------------------------+
```

### 2.1 Frontend Architecture
- **React 18 & Vite**: Built on a modern Single-Page Application (SPA) architecture utilizing Vite for rapid Hot Module Replacement (HMR) and optimized rollup production bundles.
- **Tailwind CSS & Glassmorphism Design System**: Futuristic control-room aesthetic with dark theme backgrounds (`#0a0d14`), high-contrast emergency accents (Neon Blue `#00d4ff`, Alert Red `#ff3b3b`, Emerald `#22c55e`), frosted glass backdrops (`backdrop-blur-xl`), and animated gradients.
- **React-Leaflet & Google Maps GIS**: High-performance interactive geospatial rendering engine supporting multiple tile layers (Google Satellite Hybrid, Google Streets, Google Terrain, CartoDB Dark Matter, and OpenStreetMap). Features auto-centering, GPS marker telemetry, custom pulsing icons, and Google Maps deep-link navigation.
- **Socket.IO Client**: Establishes persistent full-duplex WebSocket connections for instantaneous incident reception, live SOS broadcasts, and triage state synchronization.
- **Axios API Client**: Configured with request/response interceptors that dynamically inject JWT bearer tokens and provide automatic authorization renewal and route protection.

### 2.2 Backend Architecture
- **Node.js & Express.js**: High-throughput non-blocking asynchronous event loop handling concurrent RESTful endpoints and micro-services.
- **Socket.IO Real-Time Engine**: Coordinates bidirectional pub/sub communication channels (`sos-alert`, `new-alert`, `rescue-update`, `volunteer-location`).
- **Security & Middleware Stack**: 
  - `bcryptjs` salted password hashing (10 salt rounds).
  - `jsonwebtoken` (JWT) stateless authorization tokens.
  - `helmet` HTTP security headers.
  - `cors` cross-origin resource sharing filter.
  - `morgan` HTTP access logger.

### 2.3 Database Architecture
- **MongoDB NoSQL**: Flexible document storage designed to support polymorphic incident structures, high-frequency location coordinate arrays, and dynamic resource catalogs.
- **Mongoose ODM**: Object Data Modeling layer providing strict schema enforcement, pre-save cryptographic hooks, data sanitization, and referential model population.
- **2dsphere Geospatial Indexing**: Spherical geometry indexes (`2dsphere`) applied to coordinates `[longitude, latitude]` for lightning-fast geospatial distance lookups, radial proximity queries, and emergency perimeter filtering.

---

## 3. CORE MODULES & FUNCTIONALITY

```
+-------------------------------------------------------------------------------------+
|                                ResQ PLATFORM MODULES                                |
+-------------------------------------------------------------------------------------+
| [Module 1] User Authentication & RBAC (Citizen, Volunteer, Rescue Team, Admin)      |
| [Module 2] Incident & Disaster Reporting with Automatic GPS Telemetry               |
| [Module 3] Emergency One-Tap SOS Beacon & Real-Time Alert Distribution              |
| [Module 4] Interactive Tactical Live Map with Google Maps Multi-Layer Tiles         |
| [Module 5] Volunteer Squads & Mission Mobilization Engine                          |
| [Module 6] Rescue Squad Emergency Dispatch & Turn-by-Turn Navigation               |
| [Module 7] Emergency Relief Resource & Shelter Inventory Management                 |
| [Module 8] AI-Assisted Disaster Severity Scoring & Fake Report Detection            |
| [Module 9] Admin Command Center, Telemetry Audit & Analytics                        |
+-------------------------------------------------------------------------------------+
```

### Module 1: Role-Based Authentication & Authorization (RBAC)
- Multi-role user registration and login supporting four dedicated user classifications: **Citizen**, **Volunteer**, **Rescue Team Member**, and **Administrator**.
- Secure token issuance utilizing JSON Web Tokens (JWT) containing cryptographically signed user payloads.
- Role-specific route middleware guards in both frontend React Router (`<ProtectedRoute allowedRoles={[...]} />`) and backend Express routes (`roleCheck([...])`).

### Module 2: Disaster & Hazard Reporting
- Allows users to report emergencies categorized under Flood, Earthquake, Fire, Cyclone, Accident, Landslide, Tsunami, or Other.
- Built-in automatic GPS location detection (`navigator.geolocation`) with reverse geocoding via OpenStreetMap Nominatim API to resolve human-readable physical addresses instantly.
- Upload support for on-ground disaster photography and evidence.

### Module 3: Real-Time Emergency SOS Broadcast
- High-priority SOS broadcast trigger for individuals trapped or in immediate danger.
- Transmits precise coordinates, timestamps, and priority tags over WebSocket channels to all active rescue stations within milliseconds.
- Provides visual ping indicators and audible emergency alerts.

### Module 4: Tactical Live Map & GIS Integration
- Interactive geospatial canvas rendering incidents, field volunteers, medical facilities, and evacuation centers simultaneously.
- User-selectable tile providers: **Google Satellite Hybrid**, **Google Streets**, **Google Terrain**, **CartoDB Tactical Dark**, and **OpenStreetMap**.
- Interactive popups featuring **"Open in Google Maps"** and **"Navigate via Google Maps"** deep-links for immediate field deployment.
- Search box with automatic geocoding to fly and inspect any city or hazard perimeter globally.

### Module 5: Volunteer Management & Team Formation
- Profile management for trained first responders detailing technical rescue skills, medical credentials, and real-time availability.
- Mission assignment dashboard allowing volunteers to accept rescue tasks, track status, and accumulate field experience points.

### Module 6: Rescue Team Command & Field Navigation
- Operational triage view prioritizing incidents by severity (Critical, High, Medium, Low).
- Live mission status tracking (`pending` -> `accepted` -> `on_the_way` -> `rescued` -> `closed`).
- One-click turn-by-turn route dispatch using device GPS to guide rescue vehicles directly to victim coordinates.

### Module 7: Resource & Shelter Inventory Management
- Centralized tracking for essential crisis supplies: drinking water, food rations, medicine packs, trauma blood units, blankets, and boats.
- Threshold alerts for depleting stockpiles (`available`, `low`, `depleted`) to prevent logistics collapse during emergencies.

### Module 8: AI-Assisted Severity Scoring & Verification
- Automated heuristic and NLP inference engine evaluating incident descriptions and affected casualties.
- Generates predicted casualty impacts, calculates required supply bundles, and issues automated public safety guidelines.
- Spam and false-alarm detection algorithms to mitigate malicious or prank emergency calls.

### Module 9: Admin Telemetry & Analytics Dashboard
- Comprehensive platform oversight tracking system-wide incidents, rescue completion ratios, active volunteer density, and resource depletion metrics through Recharts data visualizations.

---

## 4. DATABASE SCHEMAS & MODELS (Mongoose)

### 4.1 User Schema (`server/models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['citizen', 'volunteer', 'rescue_team', 'admin'], 
    default: 'citizen' 
  },
  phone: { type: String },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### 4.2 Disaster Report Schema (`server/models/DisasterReport.js`)
```javascript
const disasterReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { 
    type: String, 
    enum: ['flood', 'earthquake', 'fire', 'cyclone', 'accident', 'landslide', 'tsunami', 'other'] 
  },
  description: { type: String },
  images: [{ type: String }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [lng, lat]
    address: String
  },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'] 
  },
  aiScore: { type: Number, min: 0, max: 100 },
  status: { 
    type: String, 
    enum: ['reported', 'verified', 'responding', 'resolved'], 
    default: 'reported' 
  },
  affectedCount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

disasterReportSchema.index({ location: '2dsphere' });
```

### 4.3 SOS Request Schema (`server/models/SOSRequest.js`)
```javascript
const sosRequestSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  message: { type: String },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    default: 'high' 
  },
  assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'on_the_way', 'rescued', 'closed'], 
    default: 'pending' 
  },
  responseTime: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

sosRequestSchema.index({ location: '2dsphere' });
```

### 4.4 Resource Schema (`server/models/Resource.js`)
```javascript
const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  category: { 
    type: String, 
    enum: ['food', 'water', 'medicine', 'shelter', 'vehicle', 'blood', 'clothing', 'equipment'] 
  },
  status: { 
    type: String, 
    enum: ['available', 'low', 'depleted'], 
    default: 'available' 
  },
  lastUpdated: { type: Date, default: Date.now }
});

resourceSchema.index({ location: '2dsphere' });
```

---

## 5. BACKEND RESTful & WEBSOCKET API IMPLEMENTATION

### 5.1 Main Server Configuration (`server/index.js`)
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware Stack
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

connectDB();
app.set('io', io);

// WebSocket Event Orchestration
io.on('connection', (socket) => {
  socket.on('join-room', (room) => socket.join(room));
  socket.on('sos-alert', (data) => io.emit('sos-alert', data));
  socket.on('rescue-update', (data) => io.emit('rescue-update', data));
  socket.on('volunteer-location', (data) => io.emit('volunteer-location', data));
  socket.on('new-alert', (data) => io.emit('new-alert', data));
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/disasters', require('./routes/disasterRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));
app.use('/api/volunteers', require('./routes/volunteerRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`ResQ Server running on port ${PORT}`));
```

### 5.2 Real-Time SOS Controller (`server/controllers/sosController.js`)
```javascript
const SOSRequest = require('../models/SOSRequest');

exports.createSOS = async (req, res) => {
  try {
    const sosData = { ...req.body };
    if (req.user) sosData.citizen = req.user._id;

    const sos = await SOSRequest.create(sosData);
    
    // Broadcast immediately to all connected emergency centers
    const io = req.app.get('io');
    if (io) {
      io.emit('sos-alert', sos);
    }
    
    res.status(201).json({ success: true, data: sos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

## 6. FRONTEND APPLICATION CODE

### 6.1 HTML & CSS Configuration
#### `client/index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ResQ - Intelligent Disaster Response & Rescue Platform</title>
    <meta name="description" content="AI-Powered Emergency Platform for Disaster Response" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  </head>
  <body class="bg-[#0a0d14] text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### `client/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#00d4ff',
        secondary: '#0a0f1c',
        accent: '#ff3b3b',
        dark: {
          100: '#1a1f2e',
          200: '#141825',
          300: '#0f1219',
          400: '#0a0d14'
        },
        neon: {
          blue: '#00d4ff',
          purple: '#a855f7',
          green: '#22c55e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
```

### 6.2 Interactive Live Map Component (`client/src/pages/LiveMap.jsx` - Core Excerpt)
```jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { FiActivity, FiUsers, FiCrosshair, FiSearch, FiExternalLink, FiNavigation } from 'react-icons/fi';
import 'leaflet/dist/leaflet.css';
import { detectCurrentLocation } from '../utils/location';

const TILE_LAYERS = {
  googleHybrid: {
    id: 'googleHybrid',
    name: 'Google Satellite',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  },
  googleStreets: {
    id: 'googleStreets',
    name: 'Google Streets',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
  }
};

const LiveMap = () => {
  const [activeLayer, setActiveLayer] = useState('googleHybrid');
  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    detectCurrentLocation().then(loc => setUserLoc([loc.lat, loc.lng]));
  }, []);

  return (
    <div className="w-full h-[calc(100vh-8rem)] min-h-[600px] relative rounded-3xl overflow-hidden border border-white/10">
      <MapContainer center={userLoc || [20.5937, 78.9629]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={TILE_LAYERS[activeLayer].url} subdomains={TILE_LAYERS[activeLayer].subdomains} />
        {userLoc && (
          <Marker position={userLoc}>
            <Popup>
              <div className="p-2 text-dark-400">
                <h4 className="font-bold">Your Current GPS</h4>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${userLoc[0]},${userLoc[1]}`} 
                   target="_blank" rel="noreferrer" className="text-primary font-bold">
                  Navigate via Google Maps →
                </a>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
```

---

## 7. SYSTEM OUTPUT & INTERFACE SCREENSHOTS

```
+-----------------------------------------------------------------------------------------+
|                                    PLATFORM WORKFLOW                                    |
+-----------------------------------------------------------------------------------------+
| Citizen Reports Disaster / Emits SOS Beacon -> High-Priority Broadcast to Sockets      |
|                                         |                                               |
|                      +------------------+------------------+                            |
|                      |                                     |                            |
|                      v                                     v                            |
|        Rescue Squad Triages Incident          Volunteers Mobilize Teams                 |
|                      |                                     |                            |
|                      +------------------+------------------+                            |
|                                         |                                               |
|          Live Map Turn-by-Turn Navigation via Google Maps & Resource Depletion Check    |
+-----------------------------------------------------------------------------------------+
```

### **Fig 1: Landing Page & Instant Emergency Portal**
- **Description:** Entry portal featuring direct, distinct operational gateways: "Get Started / Log In" for registered users and an immediate red-pulsing "EMERGENCY SOS" button for citizens in peril requiring zero-login access.
- *Route:* `/`

### **Fig 2: Role-Based Secure Authentication**
- **Description:** Authentication gateway featuring role switching between Citizen, Volunteer, Rescue Team, and Administrator. Encrypts credentials with bcrypt and issues JWT tokens.
- *Route:* `/login`, `/register`

### **Fig 3: Citizen Dashboard & Incident Telemetry**
- **Description:** Displays active regional danger warnings, quick SOS trigger buttons, real-time safety instructions, and a summary list of citizen-reported incidents.
- *Route:* `/dashboard` (Role: `citizen`)

### **Fig 4: Incident Report Submission with Auto-GPS Geolocation**
- **Description:** Form allowing citizens to report hazards (floods, fires, earthquakes). Features browser GPS auto-locking (`navigator.geolocation`) with reverse-geocoded physical address extraction.
- *Route:* `/dashboard/report`

### **Fig 5: Full-Screen Interactive GIS Live Map**
- **Description:** Multi-layered situational map displaying active incidents, field responders, hospitals, and relief shelters. Features Google Satellite Hybrid tiles, Google Streets, and CartoDB Dark views with one-click Google Maps Navigation buttons.
- *Route:* `/dashboard/map`

### **Fig 6: Emergency SOS Beacon Broadcast**
- **Description:** High-priority SOS trigger providing live countdown, instant acoustic alarm, and WebSocket broadcast transmission to all active rescue teams with exact victim coordinates.
- *Route:* `/dashboard/sos`

### **Fig 7: Volunteer Mission Control & Team Formation**
- **Description:** Specialized portal for registered volunteers to inspect active field emergencies, accept rescue tasks, join squads, and track their missions completed and reputation points.
- *Route:* `/dashboard/volunteers`

### **Fig 8: Rescue Squad Command Center & Field Navigation**
- **Description:** Emergency triage dashboard prioritizing critical SOS calls. Each mission card includes direct turn-by-turn navigation buttons opening Google Maps with coordinates pre-filled.
- *Route:* `/dashboard/rescue`

### **Fig 9: Resource & Shelter Inventory Management**
- **Description:** Real-time stock registry tracking hospital bed counts, blood bank units, medical kits, food, water, and shelter occupancy across emergency zones.
- *Route:* `/dashboard/resources`

### **Fig 10: Admin Central Command & Telemetry Analytics**
- **Description:** Comprehensive analytical overview displaying total incidents handled, volunteer mobilization metrics, server status, and graphical distributions of disaster classifications.
- *Route:* `/dashboard/admin`

---

## 8. CONCLUSION & FUTURE ENHANCEMENTS

### 8.1 Conclusion
The **ResQ** platform successfully demonstrates a robust, scalable, and responsive disaster coordination ecosystem built with the modern MERN stack. By integrating real-time WebSocket communication, role-based workflows, automated GPS location telemetry, and Google Maps GIS capabilities, ResQ dramatically cuts emergency communication latency and empowers citizens, volunteer teams, and professional rescue personnel to coordinate life-saving relief efforts efficiently.

### 8.2 Future Enhancements
1. **Offline-First Mesh Networking**: Progressive Web App (PWA) offline caching with Bluetooth Low Energy (BLE) or Wi-Fi Direct mesh communication for rescue coordination in areas where cellular networks collapse.
2. **UAV / Drone Imagery Integration**: Direct ingestion of aerial drone imagery feeds into Leaflet map layers for real-time flood perimeter mapping and structural damage assessment.
3. **Automated SMS / USSD Fallback Gateway**: Integration with Twilio / Africa's Talking SMS gateways to enable citizens without smartphones or internet connectivity to trigger SOS beacons via standard cellular text messages.
4. **Predictive Machine Learning Models**: Ingest historical meteorological data and hydrological sensors to forecast flood surges and wildfire propagation paths.

---

**Submitted by:**  
**NAVANEETHAN S**  
Sri Shakthi Institute of Engineering and Technology, Coimbatore – 641062
