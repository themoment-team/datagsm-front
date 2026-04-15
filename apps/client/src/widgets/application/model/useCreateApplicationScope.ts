import { applicationQueryKeys, applicationUrl, post } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationScopeRequest } from '@/entities/application';

export const useCreateApplicationScope = (
  options?: Omit<
    UseMutationOptions<
      BaseApiResponse,
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
    }) => post<BaseApiResponse>(applicationUrl.postApplicationScope(applicationId), data),
    ...options,
  });
