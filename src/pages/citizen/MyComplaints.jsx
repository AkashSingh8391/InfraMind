import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ListFilter } from 'lucide-react';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import ComplaintCard from '../../components/complaints/ComplaintCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { complaintApi } from '../../api/complaintApi';
import { COMPLAINT_STATUS } from '../../utils/constants';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  ...Object.values(COMPLAINT_STATUS).map((s) => ({ value: s, label: s.replace('_', ' ') })),
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'priority', label: 'Priority: high to low' },
];

export default function MyComplaints() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['complaints', 'mine', { search, status, sort, page }],
    queryFn: () =>
      complaintApi.getMine({ search, status, sort, page, size: 9 }).then((r) => r.data),
  });

  const complaints = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">My Complaints</h1>
        <p className="mt-1 text-sm text-ink-400">Every issue you've reported, in one place.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search your complaints…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            options={STATUS_OPTIONS}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <div className="w-full sm:w-52">
          <Select options={SORT_OPTIONS} value={sort} onChange={(e) => setSort(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : complaints.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {complaints.map((c) => (
              <ComplaintCard key={c.id} complaint={c} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-2 text-sm text-ink-400">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={ListFilter}
          title="No complaints match your filters"
          description="Try clearing search or status filters, or report a new issue."
        />
      )}
    </div>
  );
}
