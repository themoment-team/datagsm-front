import { clubQueryKeys, clubUrl, post } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUploadClubExcel = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, File>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: clubQueryKeys.postClubImport(),
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return post<BaseApiResponse>(clubUrl.postClubImport(), formData);
    },
    ...options,
  });
