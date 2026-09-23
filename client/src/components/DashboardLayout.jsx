import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-400 flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16 h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto w-full h-full relative z-10">
            <Outlet />
          </div>
          
          {/* Subtle background glow */}
          <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
