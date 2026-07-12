import { useState } from 'react';
import { Menu, Bell, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar({ onMenuClick, notifications = [] }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 bg-white/80 px-4 backdrop-blur dark:border-ink-800 dark:bg-ink-900/80 lg:px-6">
      <button
        className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <div className="relative">
          <button
            className="relative rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-signal-500" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-ink-100 bg-white p-2 shadow-raised dark:border-ink-800 dark:bg-ink-800">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase text-ink-400">
                Notifications
              </p>
              {notifications.length === 0 ? (
                <p className="px-2 py-4 text-center text-sm text-ink-400">You're all caught up.</p>
              ) : (
                <ul className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className="rounded-lg px-2 py-2 text-sm hover:bg-ink-100 dark:hover:bg-ink-700"
                    >
                      {n.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-100 dark:hover:bg-ink-800"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pulse-600 text-xs font-semibold text-white">
              {getInitials(user?.name)}
            </div>
            <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
            <ChevronDown size={14} className="text-ink-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-ink-100 bg-white p-1.5 shadow-raised dark:border-ink-800 dark:bg-ink-800">
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-500 hover:bg-danger-500/10"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
