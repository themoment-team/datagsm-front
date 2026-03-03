import { accountQueryKeys, accountUrl, oauthPost } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface SendPasswordResetEmailParams {
  email: string;
}

export const useSendPasswordResetEmail = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, SendPasswordResetEmailParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: accountQueryKeys.postPasswordReset(),
    mutationFn: (data: SendPasswordResetEmailParams) =>
      oauthPost<BaseApiResponse>(accountUrl.postPasswordReset(), data),
    ...options,
  });
