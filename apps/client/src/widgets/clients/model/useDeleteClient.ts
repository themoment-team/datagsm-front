import { clientQueryKeys, clientUrl, del } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteClient = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, string>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: clientQueryKeys.deleteClientById(),
    mutationFn: (clientId) => del<BaseApiResponse>(clientUrl.deleteClientById(clientId)),
    ...options,
  });
