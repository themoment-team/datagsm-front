import { accountQueryKeys, accountUrl, oauthPost } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface CheckEmailCodeParams {
  email: string;
  code: string;
}

export const useCheckEmailCode = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, CheckEmailCodeParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: accountQueryKeys.postEmailVerificationVerify(),
    mutationFn: (data: CheckEmailCodeParams) =>
      oauthPost<BaseApiResponse>(accountUrl.postEmailVerificationVerify(), data),
    ...options,
  });
