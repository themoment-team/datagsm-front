'use client';

import { authQueryKeys, authUrl, post } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ApiKeyResponse } from '../types';

export const useRotateApiKey = (
  options?: Omit<
    UseMutationOptions<ApiKeyResponse, AxiosError, void>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.postRotateApiKey(),
    mutationFn: () => post<ApiKeyResponse>(authUrl.postRotateApiKey()),
    ...options,
  });
