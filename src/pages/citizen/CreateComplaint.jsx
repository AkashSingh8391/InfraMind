import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Card } from '../../components/common/Card.jsx';
import ComplaintForm from '../../components/complaints/ComplaintForm.jsx';
import { complaintApi } from '../../api/complaintApi';

export default function CreateComplaint() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const { data } = await complaintApi.create(payload);
      toast.success('Your report has been submitted.');
      navigate(`/citizen/complaints/${data.id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Report an Issue</h1>
        <p className="mt-1 text-sm text-ink-400">
          Give as much detail as you can — photos and an exact pin help officers resolve it faster.
        </p>
      </div>
      <Card>
        <ComplaintForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </Card>
    </div>
  );
}
