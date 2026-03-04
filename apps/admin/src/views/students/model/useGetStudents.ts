import { get, studentQueryKeys, studentUrl } from '@repo/shared/api';
import { StudentListResponse, StudentRole, StudentSex } from '@repo/shared/types';
import { minutesToMs } from '@repo/shared/utils';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';

interface UseGetStudentsParams {
  page?: number;
  size?: number;
  grade?: number;
  classNum?: number;
  sex?: StudentSex;
  role?: StudentRole;
  includeGraduates?: boolean;
}

export const useGetStudents = (
  { page, size, grade, classNum, sex, role, includeGraduates }: UseGetStudentsParams,
  options?: Omit<UseQueryOptions<StudentListResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: studentQueryKeys.getStudents(page, size, grade, classNum, sex, role, includeGraduates),
    queryFn: () =>
      get<StudentListResponse>(
        studentUrl.getStudents(page, size, grade, classNum, sex, role, includeGraduates),
      ),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
