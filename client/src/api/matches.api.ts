import { apiClient } from './client';
import type {
  Match,
  CreateMatchRequest,
  UpdateOddsRequest,
  UpdateStatusRequest,
} from '@/types/api';

export const matchesApi = {
  getAll: () =>
    apiClient.get<Match[]>('/matches').then((res) => res.data),

  getById: (id: string) =>
    apiClient.get<Match>(`/matches/${id}`).then((res) => res.data),

  create: (data: CreateMatchRequest) =>
    apiClient.post<Match>('/matches', data).then((res) => res.data),

  updateOdds: (id: string, data: UpdateOddsRequest) =>
    apiClient.patch<Match>(`/matches/${id}/odds`, data).then((res) => res.data),

  updateStatus: (id: string, data: UpdateStatusRequest) =>
    apiClient.patch<Match>(`/matches/${id}/status`, data).then((res) => res.data),
};
