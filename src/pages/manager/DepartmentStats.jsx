import { useQuery } from '@tanstack/react-query';
import { Card, StatCard } from '../../components/common/Card.jsx';
import TrendChart from '../../components/charts/TrendChart.jsx';
import CategoryChart from '../../components/charts/CategoryChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import { complaintApi } from '../../api/complaintApi';
import { Timer, ThumbsUp, RotateCcw, Gauge } from 'lucide-react';

export default function DepartmentStats() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'department', 'detailed'],
    queryFn: () => complaintApi.getAnalytics({ scope: 'department', detailed: true }).then((r) => r.data),
  });

  if (isLoading) return <Loader />;

  const stats = data?.stats || {
    avgResolutionDays: 0,
    satisfactionScore: 0,
    reopenRate: 0,
    slaCompliance: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Department Statistics</h1>
        <p className="mt-1 text-sm text-ink-400">Deeper performance metrics for your department.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Avg. Resolution Time" value={`${stats.avgResolutionDays}d`} icon={Timer} accent="pulse" />
        <StatCard label="Citizen Satisfaction" value={`${stats.satisfactionScore}/5`} icon={ThumbsUp} accent="ok" />
        <StatCard label="Reopen Rate" value={`${stats.reopenRate}%`} icon={RotateCcw} accent="warn" />
        <StatCard label="SLA Compliance" value={`${stats.slaCompliance}%`} icon={Gauge} accent="signal" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-display text-base font-semibold">Monthly Complaint Volume</h2>
          <TrendChart data={data?.monthlyTrend || []} xKey="month" />
        </Card>
        <Card>
          <h2 className="mb-3 font-display text-base font-semibold">Issues by Category</h2>
          <CategoryChart data={data?.byCategory || []} />
        </Card>
      </div>
    </div>
  );
}
