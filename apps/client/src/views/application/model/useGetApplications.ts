import { useQuery } from '@tanstack/react-query';
import { applicationQueryKeys, applicationUrl, get } from '@repo/shared/api';
import { ApiResponse } from '@repo/shared/types';
import { ApplicationsResponse, GetApplicationsParams } from '@/entities/application';

export const useGetApplications = (params: GetApplicationsParams) => {
  return useQuery({
    queryKey: applicationQueryKeys.getApplications(params),
    queryFn: () => get<ApiResponse<ApplicationsResponse>>(applicationUrl.getApplications(params)),
  });
};
