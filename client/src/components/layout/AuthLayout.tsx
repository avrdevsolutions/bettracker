import { Outlet, Navigate } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Layout for unauthenticated pages (login, register).
 * Redirects to dashboard if already logged in.
 */
export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-void">
      {/* Left decorative panel — atmospheric */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-muted) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        {/* Primary glow */}
        <div className="absolute -left-[15%] top-[10%] h-[500px] w-[500px] rounded-full bg-primary opacity-[0.03] blur-[180px]" />
        {/* Hot glow */}
        <div className="absolute -right-[10%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-hot opacity-[0.02] blur-[150px]" />
        {/* Diagonal divider line */}
        <div className="absolute right-[45%] top-0 h-full w-px origin-top rotate-[8deg] bg-gradient-to-b from-transparent via-primary-border to-transparent opacity-40" />
      </div>

      {/* Left branding column */}
      <div className="relative hidden w-[45%] flex-col justify-between p-12 lg:flex">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-9 w-9" />
            <span className="font-display text-lg font-semibold uppercase tracking-[0.15em] text-text-primary">
              BetTracker
            </span>
          </div>
        </div>

        <div className="max-w-sm">
          <h1 className="font-display text-5xl font-bold uppercase leading-[1.1] tracking-wide text-text-primary">
            Track.
            <br />
            <span className="text-primary">Bet.</span>
            <br />
            Win.
          </h1>
          <div className="mt-4 h-[2px] w-16 bg-gradient-to-r from-primary to-transparent" />
          <p className="mt-5 text-sm leading-relaxed text-text-secondary">
            Real-time odds, instant placement, full history.
            Your edge starts here.
          </p>
        </div>

        <p className="text-[11px] tracking-wider text-text-muted">
          &copy; 2026 BetTracker
        </p>
      </div>

      {/* Right form column */}
      <div className="relative flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src="/logo.svg" alt="" className="h-9 w-9" />
            <span className="font-display text-lg font-semibold uppercase tracking-[0.15em] text-text-primary">
              BetTracker
            </span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
