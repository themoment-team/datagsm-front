import { authQueryKeys, authUrl, get } from '@repo/shared/api';
import { UserRoleType } from '@repo/shared/types';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { getAvailableScopeResponse } from '@/entities/home';

export const useGetAvailableScope = (
  userRole: UserRoleType,
  options?: Omit<UseQueryOptions<getAvailableScopeResponse>, 'queryKey' | 'queryFn'>,
): UseQueryResult<getAvailableScopeResponse> =>
  useQuery({
    queryKey: authQueryKeys.getAvailableScope(userRole),
    queryFn: () => get<getAvailableScopeResponse>(authUrl.getAvailableScope(userRole)),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
