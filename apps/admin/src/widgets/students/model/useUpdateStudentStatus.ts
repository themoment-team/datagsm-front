import { patch, studentQueryKeys, studentUrl } from '@repo/shared/api';
import { StudentListResponse, StudentRole } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface UpdateStudentStatusVariables {
  studentId: number;
  role: StudentRole;
}

export const useUpdateStudentStatus = (
  options?: Omit<
    UseMutationOptions<StudentListResponse, AxiosError, UpdateStudentStatusVariables>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  return useMutation({
    mutationKey: studentQueryKeys.patchStudentStatus(),
    mutationFn: ({ studentId, role }: UpdateStudentStatusVariables) =>
      patch<StudentListResponse>(studentUrl.patchStudentStatus(studentId), { status: role }),
    ...options,
  });
};
