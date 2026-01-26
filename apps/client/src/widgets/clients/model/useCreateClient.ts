import { clientQueryKeys, clientUrl, post } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CreateClientRequest, CreateClientResponse } from '@/entities/clients';

export const useCreateClient = (
  options?: Omit<
    UseMutationOptions<CreateClientResponse, AxiosError, CreateClientRequest>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: clientQueryKeys.postClient(),
    mutationFn: (data: CreateClientRequest) =>
      post<CreateClientResponse>(clientUrl.postClient(), data),
    ...options,
  });
