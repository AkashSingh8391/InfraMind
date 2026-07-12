import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth';
import { emailRules, passwordRules, phoneRules, requiredRule } from '../../utils/validators';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await registerUser({ ...values, role: 'CITIZEN' });
      navigate('/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-semibold">Create your account</h1>
      <p className="mt-1.5 text-sm text-ink-400">
        Join InfraPulse to report and track civic infrastructure issues.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          label="Full name"
          icon={User}
          placeholder="Akash Singh"
          error={errors.name?.message}
          {...register('name', requiredRule('Name'))}
        />
        <Input
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email', emailRules)}
        />
        <Input
          label="Phone number"
          icon={Phone}
          placeholder="98765 43210"
          error={errors.phone?.message}
          {...register('phone', phoneRules)}
        />
        <Input
          label="Password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', passwordRules)}
        />
        <Input
          label="Confirm password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-pulse-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
