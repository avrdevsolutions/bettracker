import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { useLogin } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/lib/validators';

export function Component() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login.mutate(data, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <div className="animate-fade-in-scale">
      <div className="card top-accent relative overflow-hidden p-6">
        <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-text-primary">
          Sign In
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="input-field"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-[11px] text-loss">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="input-field"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="mt-1 text-[11px] text-loss">{errors.password.message}</p>
            )}
          </div>

          {login.error && (
            <div className="accent-left-loss rounded-r bg-loss-bg/50 py-2 pl-3 pr-3">
              <p className="text-[11px] text-loss">
                {login.error instanceof Error ? login.error.message : 'Login failed'}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="btn-primary mt-1 w-full font-display text-[13px] uppercase tracking-wider"
          >
            {login.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <p className="mt-4 text-center text-[12px] text-text-muted">
        No account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
          Create one
        </Link>
      </p>
    </div>
  );
}

Component.displayName = 'LoginPage';
