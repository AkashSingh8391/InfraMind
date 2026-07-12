import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Star,
  Send,
  CheckCircle2,
  Clock,
  UserCheck,
  Wrench,
} from 'lucide-react';
import { Card } from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { StatusBadge, PriorityBadge } from '../../components/complaints/StatusBadge.jsx';
import ComplaintMap from '../../components/map/ComplaintMap.jsx';
import { complaintApi } from '../../api/complaintApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatDate, timeAgo, getInitials } from '../../utils/helpers';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';

const TIMELINE_ICONS = {
  PENDING: Clock,
  ACCEPTED: UserCheck,
  IN_PROGRESS: Wrench,
  RESOLVED: CheckCircle2,
};

export default function ComplaintDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaints', id],
    queryFn: () => complaintApi.getById(id).then((r) => r.data),
  });

  // Live status/comment updates over STOMP
  useWebSocket([`/topic/complaints/${id}`], () => {
    queryClient.invalidateQueries({ queryKey: ['complaints', id] });
  });

  useEffect(() => {
    if (complaint?.myRating) setRating(complaint.myRating);
  }, [complaint]);

  if (isLoading) return <Loader />;
  if (!complaint) return null;

  const category = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category);

  const toggleBookmark = async () => {
    try {
      if (complaint.isBookmarked) {
        await complaintApi.removeBookmark(id);
      } else {
        await complaintApi.bookmark(id);
      }
      queryClient.invalidateQueries({ queryKey: ['complaints', id] });
    } catch {
      toast.error('Could not update bookmark.');
    }
  };

  const submitComment = async () => {
    if (!comment.trim()) return;
    try {
      await complaintApi.addComment(id, { message: comment });
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['complaints', id] });
    } catch {
      toast.error('Could not post comment.');
    }
  };

  const submitRating = async (value) => {
    setRating(value);
    try {
      await complaintApi.rate(id, { rating: value });
      toast.success('Thanks for your feedback!');
    } catch {
      toast.error('Could not submit rating.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{category?.icon}</span>
            <div>
              <h1 className="font-display text-xl font-semibold">{complaint.title}</h1>
              <p className="text-xs text-ink-400">
                {category?.label} · Reported {timeAgo(complaint.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={complaint.status} />
            {complaint.priority && <PriorityBadge priority={complaint.priority} />}
            <button
              onClick={toggleBookmark}
              className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
              aria-label="Bookmark"
            >
              {complaint.isBookmarked ? (
                <BookmarkCheck size={18} className="text-pulse-600" />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
          </div>
        </div>

        {complaint.imageUrl && (
          <img
            src={complaint.imageUrl}
            alt={complaint.title}
            className="mt-4 max-h-80 w-full rounded-lg object-cover"
          />
        )}

        <p className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-ink-100">
          {complaint.description}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
          <MapPin size={13} />
          {complaint.address}
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 font-display text-base font-semibold">Location</h2>
        <ComplaintMap complaints={[complaint]} height={280} />
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-base font-semibold">Status Timeline</h2>
        <ol className="space-y-4">
          {(complaint.statusHistory || []).map((h, i) => {
            const Icon = TIMELINE_ICONS[h.status] || Clock;
            return (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pulse-600/10 text-pulse-600">
                    <Icon size={15} />
                  </div>
                  {i < complaint.statusHistory.length - 1 && (
                    <div className="mt-1 h-full w-px flex-1 bg-ink-100 dark:bg-ink-800" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold">{h.status.replace('_', ' ')}</p>
                  <p className="text-xs text-ink-400">
                    {formatDate(h.timestamp)} {h.note && `— ${h.note}`}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      {complaint.status === 'RESOLVED' && (
        <Card>
          <h2 className="mb-2 font-display text-base font-semibold">Rate the resolution</h2>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((v) => (
              <button key={v} onClick={() => submitRating(v)}>
                <Star
                  size={24}
                  className={v <= rating ? 'fill-warn-500 text-warn-500' : 'text-ink-200'}
                />
              </button>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="mb-4 font-display text-base font-semibold">
          Discussion ({complaint.comments?.length || 0})
        </h2>
        <div className="mb-4 space-y-3">
          {(complaint.comments || []).map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pulse-600 text-xs font-semibold text-white">
                {getInitials(c.authorName)}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{c.authorName}</span>{' '}
                  <span className="text-xs text-ink-400">{timeAgo(c.createdAt)}</span>
                </p>
                <p className="text-sm text-ink-700 dark:text-ink-100">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Add an update or ask a question…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitComment()}
          />
          <Button icon={Send} onClick={submitComment}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
