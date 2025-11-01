import { authQueryKeys, authUrl, get } from '@repo/shared/api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ApiKeyResponse } from '@/entities/home';

export const useGetApiKey = (
  options?: Omit<UseQueryOptions<ApiKeyResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: authQueryKeys.getApiKey(),
    queryFn: () => get<ApiKeyResponse>(authUrl.getApiKey()),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
