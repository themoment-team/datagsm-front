import { clientQueryKeys, clientUrl, get } from '@repo/shared/api';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ClientListResponse } from '@/entities/clients';

export const useGetClients = (
  options?: Omit<UseQueryOptions<ClientListResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: clientQueryKeys.getClients(),
    queryFn: () => get<ClientListResponse>(clientUrl.getClients()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
