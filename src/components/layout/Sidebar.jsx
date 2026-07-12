import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  Bookmark,
  User,
  ClipboardList,
  Users,
  BarChart3,
  Building2,
  ShieldCheck,
  ScrollText,
  Activity,
} from 'lucide-react';
import { classNames } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const NAV_CONFIG = {
  [ROLES.CITIZEN]: [
    { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/citizen/complaints/new', label: 'Report an Issue', icon: FilePlus2 },
    { to: '/citizen/complaints', label: 'My Complaints', icon: ListChecks },
    { to: '/citizen/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/citizen/profile', label: 'Profile', icon: User },
  ],
  [ROLES.OFFICER]: [
    { to: '/officer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/officer/assigned', label: 'Assigned to Me', icon: ClipboardList },
    { to: '/officer/profile', label: 'Profile', icon: User },
  ],
  [ROLES.MANAGER]: [
    { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/manager/officers', label: 'Manage Officers', icon: Users },
    { to: '/manager/stats', label: 'Department Stats', icon: BarChart3 },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Management', icon: Users },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ],
};

export default function Sidebar({ role, open }) {
  const links = NAV_CONFIG[role] || [];

  return (
    <aside
      className={classNames(
        'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-ink-100 bg-white transition-transform dark:border-ink-800 dark:bg-ink-900 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-ink-100 px-5 dark:border-ink-800">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-pulse-600">
          <Activity size={18} className="text-white" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse-dot rounded-full bg-signal-500" />
        </div>
        <span className="font-display text-lg font-semibold">InfraPulse</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              classNames(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-pulse-600 text-white'
                  : 'text-ink-700 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-100 p-4 text-xs text-ink-400 dark:border-ink-800">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} />
          <span>Secured session</span>
        </div>
      </div>
    </aside>
  );
}
