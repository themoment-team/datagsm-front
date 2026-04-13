import { applicationQueryKeys, applicationUrl, get } from '@repo/shared/api';
import { ApiResponse } from '@repo/shared/types';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { ApplicationsResponse, GetApplicationsParams } from '@/entities/application';

export const useGetApplications = (
  params: GetApplicationsParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<ApplicationsResponse>>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: applicationQueryKeys.getApplications(params),
    queryFn: () => get<ApiResponse<ApplicationsResponse>>(applicationUrl.getApplications(params)),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
