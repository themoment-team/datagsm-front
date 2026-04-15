import { applicationQueryKeys, applicationUrl, patch } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationScopeRequest } from '@/entities/application';

interface UpdateApplicationScopeParams {
  applicationId: string;
  scopeId: number;
  data: UpdateApplicationScopeRequest;
}

export const useUpdateApplicationScope = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, UpdateApplicationScopeParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.patchApplicationScope(),
    mutationFn: ({ applicationId, scopeId, data }: UpdateApplicationScopeParams) =>
      patch<BaseApiResponse>(applicationUrl.patchApplicationScope(applicationId, scopeId), data),
    ...options,
  });
