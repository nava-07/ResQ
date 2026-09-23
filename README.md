# ResQ - Intelligent Disaster Response & Rescue Platform

An intelligent disaster management and emergency coordination platform built with the MERN stack, Socket.IO, Leaflet, and Tailwind CSS.

## 🚀 Features

- **Role-Based Portals**:
  - **Citizen Dashboard**: Report incidents, request emergency SOS, locate nearby shelters and hospitals.
  - **Volunteer Dashboard**: Accept relief missions, mobilize with teams, view assignments.
  - **Rescue Squad Dashboard**: Rapid emergency triage, coordinate squads, turn-by-turn navigation.
  - **Admin Command Center**: System telemetry, audit logs, resource distribution oversight.
- **Interactive Live Map**:
  - Google Hybrid / Satellite, Streets, and Terrain tiles.
  - Auto-GPS location detection.
  - Real-time incident pins, search locations, and one-click Google Maps navigation directions.
- **Emergency SOS Broadcast**: Real-time Socket.IO alerts for immediate emergency response.
- **Resource & Mission Coordination**: Track hospital beds, medical supplies, food, and shelters.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, React-Leaflet, React Icons, Axios, Socket.IO Client.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, Bcrypt.

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas URI

### Installation

1. **Clone repository**:
   ```bash
   git clone <REPO_URL>
   cd <REPO_NAME>
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   # Update your .env values if needed
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.
