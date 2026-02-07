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
    mutationKey: studentQueryKeys.postStudentImport(),
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return post<BaseApiResponse>(studentUrl.postStudentImport(), formData);
    },
    ...options,
  });
