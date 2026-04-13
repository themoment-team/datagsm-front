import { applicationQueryKeys, applicationUrl, del } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteApplicationScope = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, { applicationId: string; scopeId: number }>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.deleteApplicationScope(),
    mutationFn: ({ applicationId, scopeId }: { applicationId: string; scopeId: number }) =>
      del<BaseApiResponse>(applicationUrl.deleteApplicationScope(applicationId, scopeId)),
    ...options,
  });
