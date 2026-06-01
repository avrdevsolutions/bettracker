import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Wraps routes that require authentication.
 * Redirects to /login if no token exists.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
