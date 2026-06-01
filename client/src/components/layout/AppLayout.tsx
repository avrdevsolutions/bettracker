import { Outlet, Navigate, useLocation } from 'react-router';
import { Header } from './Header';
import { useOddsWebSocket } from '@/hooks/useWebSocket';
import { useCurrentUser } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Main app layout — header + content.
 *
 * KYC gate: non-admin users who haven't completed verification
 * are locked to the /kyc route. They can't access dashboard,
 * matches, bets, or anything else until verified.
 */
export function AppLayout() {
  useOddsWebSocket();

  const role = useAuthStore((s) => s.user?.role);
  const { data: profile, isLoading } = useCurrentUser();
  const location = useLocation();

  // KYC gate — block non-admin users who aren't verified
  const needsKyc = !isLoading && profile && profile.kyc_status !== 'verified' && role !== 'admin';

  if (needsKyc && location.pathname !== '/kyc') {
    return <Navigate to="/kyc" replace />;
  }

  return (
    <div className="flex h-screen flex-col bg-void text-text-primary">
      <Header kycBlocked={!!needsKyc} />
      <main className="relative flex-1 overflow-y-auto bg-base p-5 lg:p-7">
        {/* Content glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-glow to-transparent" />
        <div className="relative mx-auto max-w-[1100px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
