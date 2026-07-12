import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-4 text-center dark:bg-ink-900">
      <Activity size={40} className="text-pulse-600" />
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-400">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
