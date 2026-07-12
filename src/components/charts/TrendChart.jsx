import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function TrendChart({ data = [], dataKey = 'count', xKey = 'label' }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B4B5A" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#1B4B5A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eae6" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: '#5b6461' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#5b6461' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 10, border: '1px solid #e8eae6', fontSize: 13 }}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#1B4B5A"
          strokeWidth={2}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
