import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Check, X, ArrowRight } from 'lucide-react';
import { Card } from '../../components/common/Card.jsx';
import { StatusBadge, PriorityBadge } from '../../components/complaints/StatusBadge.jsx';
import Button from '../../components/common/Button.jsx';
import Select from '../../components/common/Select.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loader from '../../components/common/Loader.jsx';
import { complaintApi } from '../../api/complaintApi';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUS } from '../../utils/constants';
import { timeAgo } from '../../utils/helpers';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...Object.values(COMPLAINT_STATUS).map((s) => ({ value: s, label: s.replace('_', ' ') })),
];

export default function AssignedComplaints() {
  const [status, setStatus] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['complaints', 'assigned', { status }],
    queryFn: () => complaintApi.getAssigned({ status }).then((r) => r.data),
  });

  const handleAccept = async (id) => {
    try {
      await complaintApi.accept(id);
      toast.success('Complaint accepted.');
      queryClient.invalidateQueries({ queryKey: ['complaints', 'assigned'] });
    } catch {
      toast.error('Could not accept complaint.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Reason for rejecting this complaint:');
    if (!reason) return;
    try {
      await complaintApi.reject(id, { reason });
      toast.success('Complaint rejected.');
      queryClient.invalidateQueries({ queryKey: ['complaints', 'assigned'] });
    } catch {
      toast.error('Could not reject complaint.');
    }
  };

  const complaints = data?.content || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Assigned to Me</h1>
          <p className="mt-1 text-sm text-ink-400">Accept, reject, or update progress on your cases.</p>
        </div>
        <div className="w-48">
          <Select options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : complaints.length ? (
        <div className="space-y-3">
          {complaints.map((c) => {
            const category = COMPLAINT_CATEGORIES.find((cat) => cat.value === c.category);
            return (
              <Card key={c.id} className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category?.icon}</span>
                  <div>
                    <p className="font-semibold">{c.title}</p>
                    <p className="text-xs text-ink-400">
                      {c.address} · {timeAgo(c.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.status} />
                  {c.priority && <PriorityBadge priority={c.priority} />}
                  {c.status === 'PENDING' && (
                    <>
                      <Button variant="outline" icon={Check} onClick={() => handleAccept(c.id)}>
                        Accept
                      </Button>
                      <Button variant="ghost" icon={X} onClick={() => handleReject(c.id)}>
                        Reject
                      </Button>
                    </>
                  )}
                  <Link to={`/officer/assigned/${c.id}`}>
                    <Button variant="outline" icon={ArrowRight}>
                      Update
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No complaints found" description="Try a different status filter." />
      )}
    </div>
  );
}
