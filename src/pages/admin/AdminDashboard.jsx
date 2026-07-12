import { useQuery } from '@tanstack/react-query';
import { Users, Building2, ClipboardList, AlertTriangle } from 'lucide-react';
import { Card, StatCard } from '../../components/common/Card.jsx';
import TrendChart from '../../components/charts/TrendChart.jsx';
import CategoryChart from '../../components/charts/CategoryChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import { complaintApi } from '../../api/complaintApi';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'system'],
    queryFn: () => complaintApi.getAnalytics({ scope: 'system' }).then((r) => r.data),
  });

  const stats = data?.stats || { totalUsers: 0, departments: 0, totalComplaints: 0, criticalOpen: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">System Overview</h1>
        <p className="mt-1 text-sm text-ink-400">Platform-wide health across every department.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} accent="pulse" />
        <StatCard label="Departments" value={stats.departments} icon={Building2} accent="signal" />
        <StatCard label="Total Complaints" value={stats.totalComplaints} icon={ClipboardList} accent="ok" />
        <StatCard label="Critical & Open" value={stats.criticalOpen} icon={AlertTriangle} accent="warn" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-display text-base font-semibold">Platform-wide Trend</h2>
          {isLoading ? <Loader /> : <TrendChart data={data?.trend || []} />}
        </Card>
        <Card>
          <h2 className="mb-3 font-display text-base font-semibold">Complaints by Category</h2>
          {isLoading ? <Loader /> : <CategoryChart data={data?.byCategory || []} />}
        </Card>
      </div>
    </div>
  );
}
