import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth.store';
import type { LoginRequest, RegisterRequest } from '@/types/api';

export const userKeys = {
  me: ['user', 'me'] as const,
};

/**
 * Fetch the current user profile.
 * Only runs when authenticated (token exists).
 */
export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: userKeys.me,
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000, // profile rarely changes, 5 min
  });
}

/**
 * Login mutation — stores token + user in Zustand on success.
 */
export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      setAuth(response.token, response.user);
    },
  });
}

/**
 * Register mutation.
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

/**
 * Logout — clears auth store and query cache.
 */
export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
  };
}
