import { applicationQueryKeys, applicationUrl, del } from '@repo/shared/api';
import { ApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteApplication = (
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, AxiosError, string>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.deleteApplicationById(),
    mutationFn: (id: string) => del<ApiResponse<void>>(applicationUrl.deleteApplicationById(id)),
    ...options,
  });
