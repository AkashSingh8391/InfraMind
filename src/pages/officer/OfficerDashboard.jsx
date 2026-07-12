import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { StatCard } from '../../components/common/Card.jsx';
import ComplaintCard from '../../components/complaints/ComplaintCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loader from '../../components/common/Loader.jsx';
import { complaintApi } from '../../api/complaintApi';
import { useAuth } from '../../hooks/useAuth';

export default function OfficerDashboard() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['complaints', 'assigned', { limit: 6 }],
    queryFn: () => complaintApi.getAssigned({ limit: 6 }).then((r) => r.data),
  });

  const stats = data?.stats || { assigned: 0, pending: 0, inProgress: 0, resolvedThisMonth: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-ink-400">Here's what's on your plate today.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Assigned to Me" value={stats.assigned} icon={ClipboardList} accent="pulse" />
        <StatCard label="Awaiting Action" value={stats.pending} icon={Clock} accent="warn" />
        <StatCard label="In Progress" value={stats.inProgress} icon={Clock} accent="signal" />
        <StatCard label="Resolved This Month" value={stats.resolvedThisMonth} icon={CheckCircle2} accent="ok" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recently assigned</h2>
          <Link to="/officer/assigned" className="text-sm font-semibold text-pulse-600 hover:underline">
            View all
          </Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.content?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.content.map((c) => (
              <ComplaintCard key={c.id} complaint={c} basePath="/officer/assigned" />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="Nothing assigned yet"
            description="New complaints assigned to you by your department manager will show up here."
          />
        )}
      </div>
    </div>
  );
}
