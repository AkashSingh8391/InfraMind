import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/common/Card.jsx';
import TrendChart from '../../components/charts/TrendChart.jsx';
import CategoryChart from '../../components/charts/CategoryChart.jsx';
import ComplaintMap from '../../components/map/ComplaintMap.jsx';
import Loader from '../../components/common/Loader.jsx';
import { complaintApi } from '../../api/complaintApi';

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'system', 'detailed'],
    queryFn: () => complaintApi.getAnalytics({ scope: 'system', detailed: true }).then((r) => r.data),
  });

  const { data: heatmap, isLoading: loadingHeatmap } = useQuery({
    queryKey: ['complaints', 'heatmap'],
    queryFn: () => complaintApi.getHeatmapData().then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Platform Analytics</h1>
        <p className="mt-1 text-sm text-ink-400">
          Complaint density, trends, and category breakdowns across all departments.
        </p>
      </div>

      <Card>
        <h2 className="mb-3 font-display text-base font-semibold">Complaint Density Map</h2>
        {loadingHeatmap ? <Loader /> : <ComplaintMap complaints={heatmap?.points || []} height={380} />}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-display text-base font-semibold">Trending Issues (30 days)</h2>
          {isLoading ? <Loader /> : <TrendChart data={data?.trend || []} />}
        </Card>
        <Card>
          <h2 className="mb-3 font-display text-base font-semibold">By Category</h2>
          {isLoading ? <Loader /> : <CategoryChart data={data?.byCategory || []} />}
        </Card>
      </div>
    </div>
  );
}
