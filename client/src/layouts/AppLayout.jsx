import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';

/**
 * Reusable AppLayout shell for TaskFlow.
 * Provides fixed top navbar, responsive collapsible sidebar, and scrollable content area
 * with an atmospheric deep emerald luxury background and subtle glowing orbit rings.
 */
export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061C16] via-[#041510] to-[#010B08] text-white flex flex-col relative overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* Concentric Orbit Rings Background (Matching Image 1) */}
      <div className="fixed -top-36 -right-36 w-[650px] h-[650px] rounded-full border border-emerald-500/15 pointer-events-none z-0" />
      <div className="fixed -top-64 -right-64 w-[980px] h-[980px] rounded-full border border-emerald-400/10 pointer-events-none z-0" />
      <div className="fixed -bottom-48 -left-48 w-[800px] h-[800px] rounded-full border border-emerald-500/10 pointer-events-none z-0" />

      {/* Atmospheric Ambient Glows */}
      <div className="fixed top-0 right-12 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-8 w-[600px] h-[600px] bg-emerald-800/15 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/3 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Top Navbar */}
      <div className="relative z-30">
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      <div className="flex flex-1 relative z-10">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area (shifted right on desktop for 240px sidebar) */}
        <div className="flex-1 md:pl-60 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
          <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
