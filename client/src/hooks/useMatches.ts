import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchesApi } from '@/api/matches.api';
import type { CreateMatchRequest, UpdateOddsRequest, UpdateStatusRequest } from '@/types/api';

export const matchKeys = {
  all: ['matches'] as const,
  detail: (id: string) => ['matches', id] as const,
};

export function useMatches() {
  return useQuery({
    queryKey: matchKeys.all,
    queryFn: matchesApi.getAll,
    staleTime: 30_000, // matches list: 30s before refetch
  });
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: matchKeys.detail(id),
    queryFn: () => matchesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateMatch() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMatchRequest) => matchesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}

export function useUpdateOdds() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOddsRequest }) =>
      matchesApi.updateOdds(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}

export function useUpdateMatchStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusRequest }) =>
      matchesApi.updateStatus(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}
