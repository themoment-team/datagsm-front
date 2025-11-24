import { authQueryKeys, authUrl, get } from '@repo/shared/api';
import { minutesToMs } from '@repo/shared/lib';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ApiKeyRenewableResponse } from '@/entities/home';

export const useGetApiKeyRenewable = (
  options?: Omit<UseQueryOptions<ApiKeyRenewableResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: authQueryKeys.getApiKeyRenewable(),
    queryFn: () => get<ApiKeyRenewableResponse>(authUrl.getApiKeyRenewable()),
    staleTime: minutesToMs(1),
    gcTime: minutesToMs(5),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
