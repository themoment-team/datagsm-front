import { applicationQueryKeys, applicationUrl, patch } from '@repo/shared/api';
import { ApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationRequest } from '@/entities/application';

export const useUpdateApplicationName = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<void>,
      AxiosError<ApiResponse<void>>,
      { id: string; data: UpdateApplicationRequest }
    >,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<
    ApiResponse<void>,
    AxiosError<ApiResponse<void>>,
    { id: string; data: UpdateApplicationRequest }
  >({
    mutationKey: applicationQueryKeys.patchApplication(),
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationRequest }) =>
      patch<ApiResponse<void>>(applicationUrl.patchApplication(id), data),
    ...options,
  });
