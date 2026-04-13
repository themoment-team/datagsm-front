import { applicationQueryKeys, applicationUrl, post } from '@repo/shared/api';
import { ApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationScopeRequest } from '@/entities/application';

export const useCreateApplicationScope = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<void>,
      AxiosError,
      { applicationId: string; data: UpdateApplicationScopeRequest }
    >,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.postApplicationScope(),
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: string;
      data: UpdateApplicationScopeRequest;
    }) => post<ApiResponse<void>>(applicationUrl.postApplicationScope(applicationId), data),
    ...options,
  });
