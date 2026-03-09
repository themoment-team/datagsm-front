import { authQueryKeys, authUrl, del } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteApiKey = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, void>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.deleteApiKey(),
    mutationFn: () => del<BaseApiResponse>(authUrl.deleteApiKey()),
    ...options,
  });
