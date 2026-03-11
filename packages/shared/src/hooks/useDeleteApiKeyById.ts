'use client';

import { authQueryKeys, authUrl, del } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteApiKeyById = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, number>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.deleteApiKeyById(),
    mutationFn: (apiKeyId: number) => del<BaseApiResponse>(authUrl.deleteApiKeyById(apiKeyId)),
    ...options,
  });
