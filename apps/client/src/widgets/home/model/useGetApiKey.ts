import { authQueryKeys, authUrl, get } from '@repo/shared/api';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ApiKeyResponse } from '@/entities/home';

export const useGetApiKey = (
  options?: Omit<UseQueryOptions<ApiKeyResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: authQueryKeys.getApiKey(),
    queryFn: () => get<ApiKeyResponse>(authUrl.getApiKey()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
