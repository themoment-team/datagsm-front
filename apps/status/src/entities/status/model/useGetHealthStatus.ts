import { healthQueryKeys } from '@repo/shared/api';
import { useQuery } from '@tanstack/react-query';

import { fetchHealthStatus } from '../api/fetchHealthStatus';
import type { HealthStatusData } from './types';

interface UseGetHealthStatusOptions {
  initialData: HealthStatusData;
}

export const useGetHealthStatus = ({ initialData }: UseGetHealthStatusOptions) =>
  useQuery({
    queryKey: healthQueryKeys.getHealth(),
    queryFn: () => fetchHealthStatus(),
    initialData,
    staleTime: 10000,
    gcTime: 300000,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
