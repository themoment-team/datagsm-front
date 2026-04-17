import { applicationQueryKeys, applicationUrl, del } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface DeleteApplicationScopeParams {
  applicationId: string;
  scopeId: number;
}

export const useDeleteApplicationScope = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, DeleteApplicationScopeParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.deleteApplicationScope(),
    mutationFn: ({ applicationId, scopeId }: DeleteApplicationScopeParams) =>
      del<BaseApiResponse>(applicationUrl.deleteApplicationScope(applicationId, scopeId)),
    ...options,
  });
