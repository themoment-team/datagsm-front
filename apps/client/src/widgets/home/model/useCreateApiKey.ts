import { authQueryKeys, authUrl, post } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyResponse } from './types';

export const useCreateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, void>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.postApiKey(),
    mutationFn: () => post<ApiKeyResponse>(authUrl.postApiKey()),
    ...options,
  });
