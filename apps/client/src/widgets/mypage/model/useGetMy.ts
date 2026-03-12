import { accountQueryKeys, accountUrl, get } from '@repo/shared/api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { MyAccountResponse } from '@/entities/mypage';

export const useGetMy = (
  options?: Omit<UseQueryOptions<MyAccountResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: accountQueryKeys.getMy(),
    queryFn: () => get<MyAccountResponse>(accountUrl.getMy()),
    ...options,
  });
