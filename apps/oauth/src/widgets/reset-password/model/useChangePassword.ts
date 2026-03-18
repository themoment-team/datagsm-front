import { accountQueryKeys, accountUrl, oauthPut } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { ChangePasswordRequestType } from '@/entities/reset-password';

export const useChangePassword = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, ChangePasswordRequestType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: accountQueryKeys.putPassword(),
    mutationFn: (data: ChangePasswordRequestType) =>
      oauthPut<BaseApiResponse>(accountUrl.putPassword(), data),
    ...options,
  });
