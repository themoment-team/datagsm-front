'use client';

import { authQueryKeys, authUrl, patch } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUpdateApiKeyExpirationById = (
  options?: Omit<
    UseMutationOptions<void, AxiosError, number>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.patchApiKeyExpirationById(),
    mutationFn: (apiKeyId: number) =>
      patch<void>(authUrl.patchApiKeyExpirationById(apiKeyId)),
    ...options,
  });
