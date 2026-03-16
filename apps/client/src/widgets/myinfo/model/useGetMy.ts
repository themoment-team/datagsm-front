import { accountQueryKeys, accountUrl, get } from '@repo/shared/api';
import { MyAccountResponse } from '@repo/shared/types';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

export const useGetMy = (
  options?: Omit<UseQueryOptions<MyAccountResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: accountQueryKeys.getMy(),
    queryFn: () => get<MyAccountResponse>(accountUrl.getMy()),
    ...options,
  });
