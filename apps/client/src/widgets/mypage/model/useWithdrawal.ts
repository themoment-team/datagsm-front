import { accountQueryKeys, accountUrl, del } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { WithdrawalFormType } from '@/entities/mypage';

export const useWithdrawal = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, WithdrawalFormType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: accountQueryKeys.deleteMy(),
    mutationFn: (data: WithdrawalFormType) =>
      del<BaseApiResponse>(accountUrl.deleteMy(), { data }),
    ...options,
  });
