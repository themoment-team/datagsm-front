import { clubQueryKeys, clubUrl, get } from '@repo/shared/api';
import { ClubListResponse, ClubType } from '@repo/shared/types';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

interface UseGetClubsParams {
  page?: number;
  size?: number;
  clubType?: ClubType;
  clubName?: string;
}

export const useGetClubs = (
  { page, size, clubType, clubName }: UseGetClubsParams,
  options?: Omit<UseQueryOptions<ClubListResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: clubQueryKeys.getClubs(page, size, clubType, clubName),
    queryFn: () => get<ClubListResponse>(clubUrl.getClubs(page, size, clubType, clubName)),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
