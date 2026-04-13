import { applicationQueryKeys, applicationUrl, patch } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationScopeRequest } from '@/entities/application';

export const useUpdateApplicationScope = (
  options?: Omit<
    UseMutationOptions<
      BaseApiResponse,
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
      patch<BaseApiResponse>(applicationUrl.patchApplicationScope(applicationId, scopeId), data),
    ...options,
  });
