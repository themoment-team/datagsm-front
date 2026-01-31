import { clientQueryKeys, clientUrl, get } from '@repo/shared/api';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { AvailableScopesResponse } from '@/entities/clients';

export const useGetAvailableScopes = (
  options?: Omit<UseQueryOptions<AvailableScopesResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: clientQueryKeys.getAvailableScopes(),
    queryFn: () => get<AvailableScopesResponse>(clientUrl.getAvailableScopes()),
    staleTime: minutesToMs(30),
    gcTime: minutesToMs(60),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
