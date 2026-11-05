import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

/**
 * Reusable AppLayout shell for TaskFlow.
 * Provides fixed top navbar, responsive collapsible sidebar, and scrollable content area.
 */
export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202938] flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area (shifted right on desktop for 240px sidebar) */}
        <div className="flex-1 md:pl-60 flex flex-col justify-between">
          <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
