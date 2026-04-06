import { applicationQueryKeys, applicationUrl, del } from '@repo/shared/api';
import { ApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteApplicationScope = (
  options?: Omit<
    UseMutationOptions<
      ApiResponse<void>,
      AxiosError<ApiResponse<void>>,
      { applicationId: string; scopeId: number }
    >,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation<ApiResponse<void>, AxiosError<ApiResponse<void>>, { applicationId: string; scopeId: number }>({
    mutationKey: applicationQueryKeys.deleteApplicationScope(),
    mutationFn: ({ applicationId, scopeId }: { applicationId: string; scopeId: number }) =>
      del<ApiResponse<void>>(applicationUrl.deleteApplicationScope(applicationId, scopeId)),
    ...options,
  });
