import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useRegister, useLogin } from '@/hooks/useAuth';
import { registerSchema, type RegisterFormData } from '@/lib/validators';

export function Component() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        login.mutate(
          { email: data.email, password: data.password },
          { onSuccess: () => navigate('/kyc') },
        );
      },
    });
  };

  return (
    <div className="animate-fade-in-scale">
      <div className="card top-accent relative overflow-hidden p-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-text-primary">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
              Name
            </label>
            <input id="name" type="text" {...register('name')} className="input-field" placeholder="Your name" />
            {errors.name && <p className="mt-1 text-[11px] text-loss">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
              Email
            </label>
            <input id="email" type="email" {...register('email')} className="input-field" placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-[11px] text-loss">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
              Password
            </label>
            <input id="password" type="password" {...register('password')} className="input-field" placeholder="Min 6 characters" />
            {errors.password && <p className="mt-1 text-[11px] text-loss">{errors.password.message}</p>}
          </div>

          {registerMutation.error && (
            <div className="accent-left-loss rounded-r bg-loss-bg/50 py-2 pl-3 pr-3">
              <p className="text-[11px] text-loss">
                {registerMutation.error instanceof Error ? registerMutation.error.message : 'Registration failed'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={registerMutation.isPending || login.isPending}
            className="btn-primary mt-1 w-full font-display text-[13px] uppercase tracking-wider"
          >
            {registerMutation.isPending ? 'Creating...' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-[12px] text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
          Sign in
        </Link>
      </p>
    </div>
  );
}

Component.displayName = 'RegisterPage';
