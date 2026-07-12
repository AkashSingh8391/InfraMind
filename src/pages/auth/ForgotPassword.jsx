import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { authApi } from '../../api/authApi';
import { emailRules } from '../../utils/validators';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(values);
      setSent(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <CheckCircle2 size={40} className="mx-auto text-ok-500" />
        <h1 className="mt-4 font-display text-xl font-semibold">Check your email</h1>
        <p className="mt-1.5 text-sm text-ink-400">
          If an account exists for that address, we've sent a link to reset your password.
        </p>
        <Link to="/login" className="mt-6 inline-block text-sm font-semibold text-pulse-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
      <p className="mt-1.5 text-sm text-ink-400">
        Enter your email and we'll send you a link to reset it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', emailRules)}
        />
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Remembered it?{' '}
        <Link to="/login" className="font-semibold text-pulse-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
