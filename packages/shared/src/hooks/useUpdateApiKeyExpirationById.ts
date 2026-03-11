'use client';

import { authQueryKeys, authUrl, patch } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useUpdateApiKeyExpirationById = (
  options?: Omit<
    UseMutationOptions<void, AxiosError, { apiKeyId: number; days: number }>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.patchApiKeyExpirationById(),
    mutationFn: ({ apiKeyId, days }: { apiKeyId: number; days: number }) =>
      patch<void>(authUrl.patchApiKeyExpirationById(apiKeyId), { days }),
    ...options,
  });
