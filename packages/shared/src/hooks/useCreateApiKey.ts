'use client';

import { authQueryKeys, authUrl, post } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyFormType, ApiKeyResponse } from '../types';

export const useCreateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, ApiKeyFormType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.postApiKey(),
    mutationFn: (data: ApiKeyFormType) => post<ApiKeyResponse>(authUrl.postApiKey(), data),
    ...options,
  });
