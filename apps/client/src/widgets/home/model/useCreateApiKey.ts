import { authQueryKeys, authUrl, post } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyResponse, CreateApiKeyType } from '@/entities/home';

export const useCreateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, CreateApiKeyType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.postApiKey(),
    mutationFn: (data: CreateApiKeyType) => post<ApiKeyResponse>(authUrl.postApiKey(), data),
    ...options,
  });
