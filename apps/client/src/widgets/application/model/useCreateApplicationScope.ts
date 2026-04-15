import { applicationQueryKeys, applicationUrl, post } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationScopeRequest } from '@/entities/application';

interface CreateApplicationScopeParams {
  applicationId: string;
  data: UpdateApplicationScopeRequest;
}

export const useCreateApplicationScope = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, CreateApplicationScopeParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.postApplicationScope(),
    mutationFn: ({ applicationId, data }: CreateApplicationScopeParams) =>
      post<BaseApiResponse>(applicationUrl.postApplicationScope(applicationId), data),
    ...options,
  });
