import { authQueryKeys, authUrl, put } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyFormType, ApiKeyResponse } from '@/entities/home';

export const useUpdateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, ApiKeyFormType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.putApiKey(),
    mutationFn: (data: ApiKeyFormType) => put<ApiKeyResponse>(authUrl.putApiKey(), data),
    ...options,
  });
