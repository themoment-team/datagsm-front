import { applicationQueryKeys, applicationUrl, del } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteApplication = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, string>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.deleteApplicationById(),
    mutationFn: (id: string) => del<BaseApiResponse>(applicationUrl.deleteApplicationById(id)),
    ...options,
  });
