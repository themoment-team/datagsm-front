import { accountQueryKeys, accountUrl, post } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { SignUpFormType } from '@/entities/signup';

export const useSignUp = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, SignUpFormType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: accountQueryKeys.postSignup(),
    mutationFn: (data: SignUpFormType) => post<BaseApiResponse>(accountUrl.postSignup(), data),
    ...options,
  });
