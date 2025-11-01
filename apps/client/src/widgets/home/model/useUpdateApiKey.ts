import { authQueryKeys, authUrl, put } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyResponse } from '@/entities/home';

export const useUpdateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, void>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.putApiKey(),
    mutationFn: () => put<ApiKeyResponse>(authUrl.putApiKey()),
    ...options,
  });
