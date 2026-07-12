import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';
import { Card } from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth';
import { userApi } from '../../api/userApi';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { getInitials } from '../../utils/helpers';
import { emailRules, phoneRules, requiredRule } from '../../utils/validators';

export default function Profile() {
  const { user, updateUserInContext } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: user?.name, email: user?.email, phone: user?.phone },
  });

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const { data } = await userApi.updateProfile(values);
      updateUserInContext(data);
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const { url } = await uploadToCloudinary(file);
      updateUserInContext({ avatarUrl: url });
      toast.success('Profile photo updated.');
    } catch {
      toast.error('Could not upload photo.');
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <h1 className="font-display text-2xl font-semibold">Your Profile</h1>

      <Card className="flex flex-col items-center gap-3">
        <div className="relative">
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pulse-600 text-xl font-semibold text-white">
              {getInitials(user?.name)}
            </div>
          )}
          <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-signal-500 text-white shadow-card">
            <Camera size={13} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        {avatarUploading && <p className="text-xs text-ink-400">Uploading…</p>}
      </Card>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full name"
            error={errors.name?.message}
            {...register('name', requiredRule('Name'))}
          />
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email', emailRules)}
          />
          <Input
            label="Phone number"
            error={errors.phone?.message}
            {...register('phone', phoneRules)}
          />
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}
