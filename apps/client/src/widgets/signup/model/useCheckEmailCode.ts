import { accountQueryKeys, accountUrl, post } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export const useCheckEmailCode = (
  email: string,
  code: string,
  options?: Omit<UseQueryOptions<BaseApiResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: accountQueryKeys.getEmailCheck(email, code),
    queryFn: () => post<BaseApiResponse>(accountUrl.getEmailCheck(), { email, code }),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
