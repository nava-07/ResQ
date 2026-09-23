import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import CitizenLogin from './pages/CitizenLogin';
import VolunteerLogin from './pages/VolunteerLogin';
import RescueLogin from './pages/RescueLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import EmergencySOS from './pages/EmergencySOS';
import Dashboard from './pages/Dashboard';
import SOSPage from './pages/SOSPage';
import ReportDisaster from './pages/ReportDisaster';
import LiveMap from './pages/LiveMap';
import AIAnalyzer from './pages/AIAnalyzer';
import ResourceManagement from './pages/ResourceManagement';
import AlertCenter from './pages/AlertCenter';
import UserManagement from './pages/UserManagement';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerMissions from './pages/VolunteerMissions';
import TeamFormation from './pages/TeamFormation';
import RescueDashboard from './pages/RescueDashboard';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: '#1a1f2e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        />
        <Routes>
          {/* Public & Authentication Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/citizen" element={<CitizenLogin />} />
          <Route path="/login/volunteer" element={<VolunteerLogin />} />
          <Route path="/login/rescue" element={<RescueLogin />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/emergency-sos" element={<EmergencySOS />} />
          <Route path="/sos" element={<EmergencySOS />} />
          
          {/* Protected Routes inside Dashboard Layout */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="sos" element={<SOSPage />} />
            <Route path="report" element={<ReportDisaster />} />
            <Route path="map" element={<LiveMap />} />
            <Route path="ai" element={<AIAnalyzer />} />
            <Route path="resources" element={<ResourceManagement />} />
            <Route path="alerts" element={<AlertCenter />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="volunteers" element={<VolunteerDashboard />} />
            <Route path="missions" element={<VolunteerMissions />} />
            <Route path="teams" element={<TeamFormation />} />
            <Route path="rescue" element={<RescueDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
