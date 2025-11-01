import { authQueryKeys, authUrl, get } from '@repo/shared/api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ApiKeyRenewableResponse } from '@/entities/home';

export const useGetApiKeyRenewable = (
  options?: Omit<UseQueryOptions<ApiKeyRenewableResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: authQueryKeys.getApiKeyRenewable(),
    queryFn: () => get<ApiKeyRenewableResponse>(authUrl.getApiKeyRenewable()),
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    ...options,
  });
