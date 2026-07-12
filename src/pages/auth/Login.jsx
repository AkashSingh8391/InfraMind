import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth';
import { emailRules } from '../../utils/validators';
import { DASHBOARD_ROUTES } from '../../utils/constants';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const user = await login(values);
      const redirectTo = location.state?.from?.pathname || DASHBOARD_ROUTES[user.role];
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mt-1.5 text-sm text-ink-400">Sign in to report and track infrastructure issues.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', emailRules)}
        />
        <div>
          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />
          <div className="mt-1.5 text-right">
            <Link to="/forgot-password" className="text-xs font-medium text-pulse-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        New to InfraPulse?{' '}
        <Link to="/register" className="font-semibold text-pulse-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
