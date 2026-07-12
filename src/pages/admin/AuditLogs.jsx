import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { userApi } from '../../api/userApi';
import { formatDate } from '../../utils/helpers';
import { Search, ScrollText } from 'lucide-react';

export default function AuditLogs() {
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', { search }],
    queryFn: () => userApi.getAuditLogs({ search }).then((r) => r.data),
  });

  const logs = data?.content || [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Audit Logs</h1>
        <p className="mt-1 text-sm text-ink-400">A record of sensitive actions taken across the platform.</p>
      </div>

      <div className="max-w-sm">
        <Input icon={Search} placeholder="Search by user or action…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <Loader />
      ) : logs.length ? (
        <Card className="divide-y divide-ink-100 p-0 dark:divide-ink-800">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{log.actorName}</span> {log.action}
                </p>
                <p className="text-xs text-ink-400">{log.targetDescription}</p>
              </div>
              <span className="text-xs text-ink-400">{formatDate(log.timestamp)}</span>
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState icon={ScrollText} title="No audit entries found" description="Actions like role changes and department edits will appear here." />
      )}
    </div>
  );
}
