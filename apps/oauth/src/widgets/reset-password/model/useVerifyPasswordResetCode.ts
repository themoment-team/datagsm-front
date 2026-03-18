import { accountQueryKeys, accountUrl, oauthPost } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface VerifyPasswordResetCodeParams {
  email: string;
  code: string;
}

export const useVerifyPasswordResetCode = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, VerifyPasswordResetCodeParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: accountQueryKeys.postPasswordResetVerification(),
    mutationFn: (data: VerifyPasswordResetCodeParams) =>
      oauthPost<BaseApiResponse>(accountUrl.postPasswordResetVerification(), data),
    ...options,
  });
