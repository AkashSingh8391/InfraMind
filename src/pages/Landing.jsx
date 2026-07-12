import { Link } from 'react-router-dom';
import { Activity, MapPin, Zap, BarChart3, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button.jsx';

const FEATURES = [
  {
    icon: MapPin,
    title: 'Pin it exactly',
    text: 'Drop a pin on OpenStreetMap or search an address — no guessing where the pothole actually is.',
  },
  {
    icon: Zap,
    title: 'AI does the busywork',
    text: 'Auto-categorization, priority scoring, and duplicate detection so nothing gets lost in triage.',
  },
  {
    icon: BarChart3,
    title: 'Live department analytics',
    text: 'Managers see trends, hotspots, and officer performance update in real time.',
  },
  {
    icon: ShieldCheck,
    title: 'Built for accountability',
    text: 'Every status change is logged and visible — citizens see exactly where their report stands.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-pulse-600">
            <Activity size={20} className="text-white" />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse-dot rounded-full bg-signal-500" />
          </div>
          <span className="font-display text-xl font-semibold">InfraPulse</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-ink-700 hover:underline dark:text-ink-100">
            Sign In
          </Link>
          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center">
        <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
          Report it once.
          <br />
          <span className="text-pulse-600">Watch it get fixed.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-ink-400">
          InfraPulse turns scattered civic complaints — potholes, broken lights, water
          leaks — into a live, trackable pipeline your municipality or campus can
          actually act on.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/register">
            <Button variant="accent" className="px-6">
              Report an Issue
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="px-6">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid gap-5 text-left sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-pulse-600/10 text-pulse-600">
                <Icon size={18} />
              </div>
              <p className="font-display font-semibold">{title}</p>
              <p className="mt-1 text-sm text-ink-400">{text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
