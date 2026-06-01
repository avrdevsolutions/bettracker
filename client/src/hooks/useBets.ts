import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { betsApi } from '@/api/bets.api';
import type { PlaceBetRequest } from '@/types/api';

export const betKeys = {
  mine: ['bets', 'mine'] as const,
};

export function useMyBets(page = 1) {
  return useQuery({
    queryKey: [...betKeys.mine, page] as const,
    queryFn: () => betsApi.getMyBets(page),
    staleTime: 60_000, // bet history: 1 min
  });
}

export function usePlaceBet() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: PlaceBetRequest) => betsApi.placeBet(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: betKeys.mine });
    },
  });
}
