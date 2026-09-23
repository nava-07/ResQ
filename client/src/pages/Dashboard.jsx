import React from 'react';
import { useAuth } from '../context/AuthContext';
import CitizenDashboard from './CitizenDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import AdminDashboard from './AdminDashboard';
import RescueDashboard from './RescueDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading && !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-gray-400">Loading Operational Clearance...</span>
        </div>
      </div>
    );
  }

  const role = user?.role || user?.user?.role || 'citizen';

  if (role === 'admin') {
    return <AdminDashboard />;
  }
  if (role === 'rescue_team') {
    return <RescueDashboard />;
  }
  if (role === 'volunteer') {
    return <VolunteerDashboard />;
  }
  
  return <CitizenDashboard />;
};

export default Dashboard;
