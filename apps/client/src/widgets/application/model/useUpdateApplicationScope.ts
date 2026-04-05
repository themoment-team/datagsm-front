import { applicationQueryKeys, applicationUrl, patch } from '@repo/shared/api';
import { ApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationScopeRequest } from '@/entities/application';

export const useUpdateApplicationScope = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<void>,
      AxiosError,
      { applicationId: string; scopeId: number; data: UpdateApplicationScopeRequest }
    >,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.patchApplicationScope(),
    mutationFn: ({
      applicationId,
      scopeId,
      data,
    }: {
      applicationId: string;
      scopeId: number;
      data: UpdateApplicationScopeRequest;
    }) =>
      patch<ApiResponse<void>>(applicationUrl.patchApplicationScope(applicationId, scopeId), data),
    ...options,
  });
