import { applicationQueryKeys, applicationUrl, post } from '@repo/shared/api';
import { ApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CreateApplicationRequest } from '@/entities/application';

export const useCreateApplication = (
  options?: Omit<
    UseMutationOptions<ApiResponse<void>, AxiosError<ApiResponse<void>>, CreateApplicationRequest>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<ApiResponse<void>, AxiosError<ApiResponse<void>>, CreateApplicationRequest>({
    mutationKey: applicationQueryKeys.postApplication(),
    mutationFn: (data: CreateApplicationRequest) =>
      post<ApiResponse<void>>(applicationUrl.postApplication(), data),
    ...options,
  });
