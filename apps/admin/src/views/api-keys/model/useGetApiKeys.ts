import { authQueryKeys, authUrl, get } from '@repo/shared/api';
import { ApiKeyListResponse } from '@repo/shared/types';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

interface UseGetApiKeysParams {
  page?: number;
  size?: number;
  id?: number;
  accountId?: number;
  scope?: string;
  isExpired?: boolean;
  isRenewable?: boolean;
}

export const useGetApiKeys = (
  params: UseGetApiKeysParams,
  options?: Omit<UseQueryOptions<ApiKeyListResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: authQueryKeys.getApiKeys(params),
    queryFn: () => get<ApiKeyListResponse>(authUrl.getApiKeys(params)),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
