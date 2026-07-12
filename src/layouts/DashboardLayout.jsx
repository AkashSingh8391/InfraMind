import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Navbar from '../components/layout/Navbar.jsx';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const { role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      <Sidebar role={role} open={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} notifications={[]} />
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
