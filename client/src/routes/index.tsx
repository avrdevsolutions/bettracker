import { createBrowserRouter } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

export const router = createBrowserRouter([
  // ── Public routes (login, register) ──
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', lazy: () => import('@/pages/LoginPage') },
      { path: '/register', lazy: () => import('@/pages/RegisterPage') },
    ],
  },

  // ── Protected routes (require auth) ──
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, lazy: () => import('@/pages/DashboardPage') },
          { path: '/matches', lazy: () => import('@/pages/MatchesPage') },
          { path: '/matches/:id', lazy: () => import('@/pages/MatchDetailPage') },
          { path: '/bets', lazy: () => import('@/pages/MyBetsPage') },
          { path: '/kyc', lazy: () => import('@/pages/KycPage') },

          // Admin
          { path: '/admin/matches', lazy: () => import('@/pages/AdminMatchesPage') },
          { path: '/admin/kyc', lazy: () => import('@/pages/AdminKycPage') },
        ],
      },
    ],
  },

  // ── 404 ──
  { path: '*', lazy: () => import('@/pages/NotFoundPage') },
]);
