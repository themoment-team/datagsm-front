import { applicationQueryKeys, applicationUrl, post } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CreateApplicationRequest } from '@/entities/application';

export const useCreateApplication = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, CreateApplicationRequest>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.postApplication(),
    mutationFn: (data: CreateApplicationRequest) =>
      post<BaseApiResponse>(applicationUrl.postApplication(), data),
    ...options,
  });
