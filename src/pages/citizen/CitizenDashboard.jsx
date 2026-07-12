import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FilePlus2, ListChecks, Clock, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import ComplaintMap from '../../components/map/ComplaintMap.jsx';
import ComplaintCard from '../../components/complaints/ComplaintCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loader from '../../components/common/Loader.jsx';
import { complaintApi } from '../../api/complaintApi';
import { useAuth } from '../../hooks/useAuth';

export default function CitizenDashboard() {
  const { user } = useAuth();

  const { data: mine, isLoading: loadingMine } = useQuery({
    queryKey: ['complaints', 'mine', { limit: 3 }],
    queryFn: () => complaintApi.getMine({ limit: 3 }).then((r) => r.data),
  });

  const { data: nearby, isLoading: loadingNearby } = useQuery({
    queryKey: ['complaints', 'nearby'],
    queryFn: () => complaintApi.getNearby({ radiusKm: 3 }).then((r) => r.data),
  });

  const stats = mine?.stats || { total: 0, pending: 0, inProgress: 0, resolved: 0 };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            Hi {user?.name?.split(' ')[0]}, what needs fixing today?
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Track your reports or spot issues already flagged nearby.
          </p>
        </div>
        <Link to="/citizen/complaints/new">
          <Button icon={FilePlus2}>Report an Issue</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Reports" value={stats.total} icon={ListChecks} accent="pulse" />
        <StatCard label="Pending" value={stats.pending} icon={Clock} accent="warn" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} accent="signal" />
        <StatCard label="Resolved" value={stats.resolved} icon={CheckCircle2} accent="ok" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Issues near you</h2>
          <Link to="/citizen/complaints" className="text-sm font-semibold text-pulse-600 hover:underline">
            View all
          </Link>
        </div>
        {loadingNearby ? (
          <Loader />
        ) : (
          <ComplaintMap complaints={nearby?.content || []} />
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Your recent reports</h2>
          <Link to="/citizen/complaints" className="text-sm font-semibold text-pulse-600 hover:underline">
            View all
          </Link>
        </div>
        {loadingMine ? (
          <Loader />
        ) : mine?.content?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mine.content.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={FilePlus2}
            title="No reports yet"
            description="You haven't reported any infrastructure issues yet. Start with one now."
            action={
              <Link to="/citizen/complaints/new">
                <Button>Report an Issue</Button>
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
