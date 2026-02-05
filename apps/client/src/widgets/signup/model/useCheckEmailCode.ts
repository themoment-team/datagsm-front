import { accountQueryKeys, accountUrl, post } from '@repo/shared/api';
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
    mutationKey: accountQueryKeys.postEmailCheck(),
    mutationFn: (data: CheckEmailCodeParams) =>
      post<BaseApiResponse>(accountUrl.postEmailCheck(), data),
    ...options,
  });
