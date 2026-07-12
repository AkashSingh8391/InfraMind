import { useQuery } from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';
import ComplaintCard from '../../components/complaints/ComplaintCard.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Loader from '../../components/common/Loader.jsx';
import { complaintApi } from '../../api/complaintApi';

export default function Bookmarks() {
  const { data, isLoading } = useQuery({
    queryKey: ['complaints', 'bookmarks'],
    queryFn: () => complaintApi.getBookmarks().then((r) => r.data),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Bookmarked Complaints</h1>
        <p className="mt-1 text-sm text-ink-400">Issues you're keeping an eye on.</p>
      </div>

      {isLoading ? (
        <Loader />
      ) : data?.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Bookmark complaints from the map or list to track them here."
        />
      )}
    </div>
  );
}
