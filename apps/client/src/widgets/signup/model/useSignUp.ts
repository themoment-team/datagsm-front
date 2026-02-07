import { accountQueryKeys, accountUrl, post } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { SignUpRequestType } from '@/entities/signup';

export const useSignUp = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, SignUpRequestType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: accountQueryKeys.postAccount(),
    mutationFn: (data: SignUpRequestType) => post<BaseApiResponse>(accountUrl.postAccount(), data),
    ...options,
  });
