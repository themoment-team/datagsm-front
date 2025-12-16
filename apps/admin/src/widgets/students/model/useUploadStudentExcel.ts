import { post, studentQueryKeys, studentUrl } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUploadStudentExcel = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, File>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: studentQueryKeys.postStudentExcel(),
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return post<BaseApiResponse>(studentUrl.postStudentExcel(), formData);
    },
    ...options,
  });
