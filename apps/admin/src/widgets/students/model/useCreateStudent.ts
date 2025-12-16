import { post, studentQueryKeys, studentUrl } from '@repo/shared/api';
import { StudentListResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { AddStudentType } from '@/entities/student';

export const useCreateStudent = (
  options?: Omit<
    UseMutationOptions<StudentListResponse, AxiosError, AddStudentType>,
    'mutationKey' | 'mutationFn'
  >,
) => {
  return useMutation({
    mutationKey: studentQueryKeys.postStudent(),
    mutationFn: (data: AddStudentType) => post<StudentListResponse>(studentUrl.postStudent(), data),
    ...options,
  });
};
