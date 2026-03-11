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
  includeWithdrawn?: boolean;
  onlyEnrolled?: boolean;
}

export const useGetStudents = (
  {
    page,
    size,
    grade,
    classNum,
    sex,
    role,
    includeGraduates,
    includeWithdrawn,
    onlyEnrolled,
  }: UseGetStudentsParams,
  options?: Omit<UseQueryOptions<StudentListResponse>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: studentQueryKeys.getStudents(
      page,
      size,
      grade,
      classNum,
      sex,
      role,
      includeGraduates,
      includeWithdrawn,
      onlyEnrolled,
    ),
    queryFn: () =>
      get<StudentListResponse>(
        studentUrl.getStudents(
          page,
          size,
          grade,
          classNum,
          sex,
          role,
          includeGraduates,
          includeWithdrawn,
          onlyEnrolled,
        ),
      ),
    staleTime: minutesToMs(5),
    gcTime: minutesToMs(10),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
