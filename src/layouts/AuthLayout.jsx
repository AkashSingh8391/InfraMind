import { Outlet, Link } from 'react-router-dom';
import { Activity, MapPin, Bell, BarChart3 } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <Link to="/" className="mb-10 flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-pulse-600">
            <Activity size={20} className="text-white" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse-dot rounded-full bg-signal-500" />
          </div>
          <span className="font-display text-xl font-semibold">InfraPulse</span>
        </Link>
        <Outlet />
      </div>

      {/* Right: brand panel */}
      <div className="relative hidden overflow-hidden bg-pulse-700 lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="relative z-10 max-w-md text-white">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            Every pothole reported.
            <br />
            Every fix, tracked live.
          </h2>
          <p className="mt-4 text-pulse-100">
            InfraPulse connects citizens, field officers, and municipal teams on one
            live map — so infrastructure issues get seen, assigned, and resolved
            faster.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { icon: MapPin, text: 'Pin the exact location on a live map' },
              { icon: Bell, text: 'Get real-time updates as work progresses' },
              { icon: BarChart3, text: 'Departments track performance with live analytics' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={16} />
                </div>
                <span className="text-sm text-pulse-50">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
