import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { Card } from '../../components/common/Card.jsx';
import Select from '../../components/common/Select.jsx';
import Loader from '../../components/common/Loader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { StatusBadge, PriorityBadge } from '../../components/complaints/StatusBadge.jsx';
import { complaintApi } from '../../api/complaintApi';
import { userApi } from '../../api/userApi';
import { getInitials, timeAgo } from '../../utils/helpers';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';

export default function ManageOfficers() {
  const queryClient = useQueryClient();

  const { data: officers, isLoading: loadingOfficers } = useQuery({
    queryKey: ['officers'],
    queryFn: () => userApi.getOfficers().then((r) => r.data),
  });

  const { data: unassigned, isLoading: loadingComplaints } = useQuery({
    queryKey: ['complaints', 'unassigned'],
    queryFn: () => complaintApi.getAll({ unassigned: true }).then((r) => r.data),
  });

  const assign = async (complaintId, officerId) => {
    if (!officerId) return;
    try {
      await complaintApi.assignOfficer(complaintId, officerId);
      toast.success('Complaint assigned.');
      queryClient.invalidateQueries({ queryKey: ['complaints', 'unassigned'] });
    } catch {
      toast.error('Could not assign complaint.');
    }
  };

  const officerOptions = [
    { value: '', label: 'Assign an officer…' },
    ...(officers || []).map((o) => ({ value: o.id, label: `${o.name} (${o.activeCount} active)` })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Manage Officers</h1>
        <p className="mt-1 text-sm text-ink-400">Review your team and assign incoming complaints.</p>
      </div>

      <Card>
        <h2 className="mb-4 font-display text-base font-semibold">Your Officers</h2>
        {loadingOfficers ? (
          <Loader />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(officers || []).map((o) => (
              <div key={o.id} className="flex items-center gap-3 rounded-lg border border-ink-100 p-3 dark:border-ink-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pulse-600 text-sm font-semibold text-white">
                  {getInitials(o.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold">{o.name}</p>
                  <p className="text-xs text-ink-400">{o.activeCount} active · {o.resolvedCount} resolved</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-base font-semibold">Unassigned Complaints</h2>
        {loadingComplaints ? (
          <Loader />
        ) : unassigned?.content?.length ? (
          <div className="space-y-3">
            {unassigned.content.map((c) => {
              const category = COMPLAINT_CATEGORIES.find((cat) => cat.value === c.category);
              return (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink-100 p-3 dark:border-ink-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category?.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{c.title}</p>
                      <p className="text-xs text-ink-400">{c.address} · {timeAgo(c.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.priority && <PriorityBadge priority={c.priority} />}
                    <StatusBadge status={c.status} />
                    <div className="w-56">
                      <Select
                        options={officerOptions}
                        defaultValue=""
                        onChange={(e) => assign(c.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={UserPlus} title="Nothing to assign" description="All incoming complaints have an officer assigned." />
        )}
      </Card>
    </div>
  );
}
