import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { authQueryKeys, authUrl, post } from '../api';
import { SignInFormType, SignInResponse } from '../types';

export const useSignIn = (
  options?: Omit<
    UseMutationOptions<SignInResponse, AxiosError, SignInFormType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: authQueryKeys.postLogin(),
    mutationFn: (data: SignInFormType) => post<SignInResponse>(authUrl.postLogin(), data),
    ...options,
  });
