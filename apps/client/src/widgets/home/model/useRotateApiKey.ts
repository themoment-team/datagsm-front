import { authQueryKeys, authUrl, post } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyFormType, ApiKeyResponse } from '@/entities/home';

export const useRotateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, ApiKeyFormType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.postRotateApiKey(),
    mutationFn: (data: ApiKeyFormType) => post<ApiKeyResponse>(authUrl.postRotateApiKey(), data),
    ...options,
  });
