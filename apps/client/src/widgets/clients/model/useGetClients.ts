import { clientQueryKeys, clientUrl, get } from '@repo/shared/api';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ClientListResponse } from '@/entities/clients';

interface UseGetClientsParams {
  page?: number;
  size?: number;
}

export const useGetClients = (
  { page, size }: UseGetClientsParams = {},
  options?: Omit<UseQueryOptions<ClientListResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: clientQueryKeys.getClients(page, size),
    queryFn: () => get<ClientListResponse>(clientUrl.getClients(page, size)),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
