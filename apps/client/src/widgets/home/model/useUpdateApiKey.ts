import { authQueryKeys, authUrl, put } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyResponse, UpdateAPiKeyType } from '@/entities/home';

export const useUpdateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, UpdateAPiKeyType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.putApiKey(),
    mutationFn: (data: UpdateAPiKeyType) => put<ApiKeyResponse>(authUrl.putApiKey(), data),
    ...options,
  });
