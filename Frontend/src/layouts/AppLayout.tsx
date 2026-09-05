import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { Topbar } from '../components/common/Topbar';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f3f7fa] flex text-[#152737] font-sans antialiased">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main portal layout area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-4 lg:p-6 min-w-0">
          <Outlet context={{ searchQuery }} />
        </main>

        <footer className="px-5 py-3.5 bg-white border-t border-[#e2e9ee] text-[11px] text-[#7b8f9c] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 <strong>KOYLA DRISHTI</strong> · Ministry of Coal · Government of India
          </span>
          <span className="font-semibold text-[#546e80]">
            AI-Powered Smart Mine Governance & Compliance Intelligence System
          </span>
        </footer>
      </div>
    </div>
  );
};
