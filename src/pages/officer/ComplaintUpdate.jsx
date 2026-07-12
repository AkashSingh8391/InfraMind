import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ImagePlus, Send } from 'lucide-react';
import { Card } from '../../components/common/Card.jsx';
import Textarea from '../../components/common/Textarea.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { StatusBadge } from '../../components/complaints/StatusBadge.jsx';
import { complaintApi } from '../../api/complaintApi';
import { useWebSocket } from '../../hooks/useWebSocket';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { timeAgo, getInitials } from '../../utils/helpers';

const NEXT_STATUS_OPTIONS = [
  { value: 'IN_PROGRESS', label: 'Mark as In Progress' },
  { value: 'RESOLVED', label: 'Mark as Resolved' },
];

export default function ComplaintUpdate() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [note, setNote] = useState('');
  const [nextStatus, setNextStatus] = useState('IN_PROGRESS');
  const [photoFile, setPhotoFile] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaints', id],
    queryFn: () => complaintApi.getById(id).then((r) => r.data),
  });

  const { publish } = useWebSocket([`/topic/complaints/${id}`], () => {
    queryClient.invalidateQueries({ queryKey: ['complaints', id] });
  });

  if (isLoading) return <Loader />;
  if (!complaint) return null;

  const submitUpdate = async () => {
    setSubmitting(true);
    try {
      let photoUrl = null;
      if (photoFile) {
        const uploaded = await uploadToCloudinary(photoFile);
        photoUrl = uploaded.url;
      }
      await complaintApi.updateProgress(id, { status: nextStatus, note, photoUrl });
      toast.success('Progress updated.');
      setNote('');
      setPhotoFile(null);
      queryClient.invalidateQueries({ queryKey: ['complaints', id] });
    } catch {
      toast.error('Could not save update.');
    } finally {
      setSubmitting(false);
    }
  };

  const sendChat = () => {
    if (!chatMessage.trim()) return;
    publish(`/app/complaints/${id}/chat`, { message: chatMessage });
    setChatMessage('');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold">{complaint.title}</h1>
          <p className="text-xs text-ink-400">{complaint.address}</p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <Card className="space-y-4">
        <h2 className="font-display text-base font-semibold">Log a Progress Update</h2>
        <Select
          label="Update status to"
          options={NEXT_STATUS_OPTIONS}
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
        />
        <Textarea
          label="Notes"
          placeholder="What did you observe or complete on site?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <div>
          <label className="label">Progress photo (optional)</label>
          <label className="flex h-24 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-ink-200 text-sm text-ink-400 hover:border-pulse-500 hover:text-pulse-600 dark:border-ink-700">
            <ImagePlus size={16} />
            {photoFile ? photoFile.name : 'Upload a site photo'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
        <Button className="w-full" isLoading={submitting} onClick={submitUpdate}>
          Save Update
        </Button>
      </Card>

      <Card>
        <h2 className="mb-3 font-display text-base font-semibold">Chat with Citizen</h2>
        <div className="mb-3 max-h-56 space-y-3 overflow-y-auto">
          {(complaint.comments || []).map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pulse-600 text-[10px] font-semibold text-white">
                {getInitials(c.authorName)}
              </div>
              <div>
                <p className="text-xs text-ink-400">
                  {c.authorName} · {timeAgo(c.createdAt)}
                </p>
                <p className="text-sm">{c.message}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Send a message…"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChat()}
          />
          <Button icon={Send} onClick={sendChat}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
