'use client';

import { authQueryKeys, authUrl, patch } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface ExtendApiKeyParams {
  apiKeyId: number;
  days: number;
}

export const useUpdateApiKeyExpirationById = (
  options?: Omit<UseMutationOptions<void, AxiosError, ExtendApiKeyParams>, 'mutationKey' | 'mutationFn'>,
) =>
  useMutation({
    mutationKey: authQueryKeys.patchApiKeyExpirationById(),
    mutationFn: ({ apiKeyId, days }: ExtendApiKeyParams) =>
      patch<void>(authUrl.patchApiKeyExpirationById(apiKeyId), { days }),
    ...options,
  });
