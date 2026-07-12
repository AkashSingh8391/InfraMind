import { Link } from 'react-router-dom';
import { MapPin, MessageSquare, Star } from 'lucide-react';
import { Card } from '../common/Card.jsx';
import { StatusBadge, PriorityBadge } from './StatusBadge.jsx';
import { COMPLAINT_CATEGORIES } from '../../utils/constants';
import { timeAgo, truncate } from '../../utils/helpers';

export default function ComplaintCard({ complaint, basePath = '/citizen/complaints' }) {
  const category = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category);

  return (
    <Card className="flex flex-col gap-3 transition-shadow hover:shadow-raised">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category?.icon}</span>
          <div>
            <p className="font-display font-semibold leading-tight">{complaint.title}</p>
            <p className="text-xs text-ink-400">{category?.label}</p>
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {complaint.imageUrl && (
        <img
          src={complaint.imageUrl}
          alt={complaint.title}
          className="h-36 w-full rounded-lg object-cover"
        />
      )}

      <p className="text-sm text-ink-700 dark:text-ink-100">
        {truncate(complaint.description, 110)}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-ink-400">
        <MapPin size={13} />
        <span className="truncate">{complaint.address}</span>
      </div>

      <div className="flex items-center justify-between border-t border-ink-100 pt-3 text-xs text-ink-400 dark:border-ink-800">
        <div className="flex items-center gap-3">
          <span>{timeAgo(complaint.createdAt)}</span>
          {complaint.priority && <PriorityBadge priority={complaint.priority} />}
        </div>
        <div className="flex items-center gap-3">
          {complaint.commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={13} /> {complaint.commentCount}
            </span>
          )}
          {complaint.rating && (
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-warn-500 text-warn-500" /> {complaint.rating}
            </span>
          )}
        </div>
      </div>

      <Link
        to={`${basePath}/${complaint.id}`}
        className="btn-outline w-full justify-center text-sm"
      >
        View details
      </Link>
    </Card>
  );
}
