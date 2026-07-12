import { useQuery } from '@tanstack/react-query';
import { Users, ClipboardList, TrendingUp, Award } from 'lucide-react';
import { StatCard, Card } from '../../components/common/Card.jsx';
import TrendChart from '../../components/charts/TrendChart.jsx';
import CategoryChart from '../../components/charts/CategoryChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import { getInitials } from '../../utils/helpers';
import { complaintApi } from '../../api/complaintApi';
import { userApi } from '../../api/userApi';

export default function ManagerDashboard() {
  const { data: analytics, isLoading: loadingAnalytics } = useQuery({
    queryKey: ['analytics', 'department'],
    queryFn: () => complaintApi.getAnalytics({ scope: 'department' }).then((r) => r.data),
  });

  const { data: leaderboard, isLoading: loadingLeaderboard } = useQuery({
    queryKey: ['officers', 'leaderboard'],
    queryFn: () => userApi.getOfficerLeaderboard().then((r) => r.data),
  });

  const stats = analytics?.stats || { officers: 0, activeComplaints: 0, resolvedThisMonth: 0, avgResolutionDays: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Department Overview</h1>
        <p className="mt-1 text-sm text-ink-400">Track team performance and complaint trends.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Officers" value={stats.officers} icon={Users} accent="pulse" />
        <StatCard label="Active Complaints" value={stats.activeComplaints} icon={ClipboardList} accent="signal" />
        <StatCard label="Resolved This Month" value={stats.resolvedThisMonth} icon={TrendingUp} accent="ok" />
        <StatCard label="Avg. Resolution Time" value={`${stats.avgResolutionDays}d`} icon={Award} accent="warn" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-display text-base font-semibold">Complaints Trend (30 days)</h2>
          {loadingAnalytics ? <Loader /> : <TrendChart data={analytics?.trend || []} />}
        </Card>
        <Card>
          <h2 className="mb-3 font-display text-base font-semibold">By Category</h2>
          {loadingAnalytics ? <Loader /> : <CategoryChart data={analytics?.byCategory || []} />}
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 font-display text-base font-semibold">Officer Leaderboard</h2>
        {loadingLeaderboard ? (
          <Loader />
        ) : (
          <div className="space-y-3">
            {(leaderboard || []).map((o, i) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-ink-100 dark:hover:bg-ink-800">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-sm font-semibold text-ink-400">#{i + 1}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pulse-600 text-xs font-semibold text-white">
                    {getInitials(o.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{o.name}</p>
                    <p className="text-xs text-ink-400">{o.resolvedCount} resolved · avg {o.avgResolutionDays}d</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-ok-600">{o.rating}★</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
