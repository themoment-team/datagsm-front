import { get, studentQueryKeys, studentUrl } from '@repo/shared/api';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

import { StudentListResponse } from '@/entities/student';

interface UseGetStudentsParams {
  page: number;
  size: number;
}

export const useGetStudents = (
  { page, size }: UseGetStudentsParams,
  options?: Omit<UseQueryOptions<StudentListResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: studentQueryKeys.getStudents(page, size),
    queryFn: () => get<StudentListResponse>(studentUrl.getStudents(page, size)),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
