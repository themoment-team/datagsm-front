import { get, studentQueryKeys, studentUrl } from '@repo/shared/api';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { StudentListResponse } from '@/entities/student';

export const useGetStudents = (
  options?: Omit<UseQueryOptions<StudentListResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: studentQueryKeys.getStudents(),
    queryFn: () => get<StudentListResponse>(studentUrl.getStudents()),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
