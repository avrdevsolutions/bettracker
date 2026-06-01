import { apiClient } from './client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '@/types/api';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((res) => res.data),

  register: (data: RegisterRequest) =>
    apiClient.post<User>('/auth/register', data).then((res) => res.data),

  getMe: () =>
    apiClient.get<User>('/users/me').then((res) => res.data),
};
