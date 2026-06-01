import { apiClient } from './client';
import type { Bet, PlaceBetRequest } from '@/types/api';

export const betsApi = {
  placeBet: (data: PlaceBetRequest) =>
    apiClient.post<Bet>('/bets', data).then((res) => res.data),

  getMyBets: (page = 1, limit = 20) =>
    apiClient
      .get<Bet[]>('/bets/mine', { params: { page, limit } })
      .then((res) => res.data),
};
