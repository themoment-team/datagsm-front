import { authQueryKeys, authUrl, put } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyResponse, UpdateApiKeyType } from '@/entities/home';

export const useUpdateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, UpdateApiKeyType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.putApiKey(),
    mutationFn: (data: UpdateApiKeyType) => put<ApiKeyResponse>(authUrl.putApiKey(), data),
    ...options,
  });
