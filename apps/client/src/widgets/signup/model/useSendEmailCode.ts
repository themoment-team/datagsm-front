import { accountQueryKeys, accountUrl, oauthPost } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface SendEmailCodeParams {
  email: string;
}

export const useSendEmailCode = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, SendEmailCodeParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: accountQueryKeys.postEmailVerification(),
    mutationFn: (data: SendEmailCodeParams) =>
      oauthPost<BaseApiResponse>(accountUrl.postEmailVerification(), data),
    ...options,
  });
