import { put, studentQueryKeys, studentUrl } from '@repo/shared/api';
import { StudentListResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { AddStudentType } from '@/entities/student';

interface UpdateStudentVariables {
  studentId: number;
  data: AddStudentType;
}

export const useUpdateStudent = (
  options?: Omit<
    UseMutationOptions<StudentListResponse, AxiosError, UpdateStudentVariables>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  return useMutation({
    mutationKey: studentQueryKeys.putStudentById(),
    mutationFn: ({ studentId, data }: UpdateStudentVariables) =>
      put<StudentListResponse>(studentUrl.putStudentById(studentId), data),
    ...options,
  });
};
