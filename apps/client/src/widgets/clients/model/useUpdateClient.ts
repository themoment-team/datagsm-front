import { clientQueryKeys, clientUrl, patch } from '@repo/shared/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateClientRequest, UpdateClientResponse } from '@/entities/clients';

interface UpdateClientParams {
  clientId: string;
  data: UpdateClientRequest;
}

export const useUpdateClient = (
  options?: Omit<
    UseMutationOptions<UpdateClientResponse, AxiosError, UpdateClientParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: clientQueryKeys.patchClientById(),
    mutationFn: ({ clientId, data }) =>
      patch<UpdateClientResponse>(clientUrl.patchClientById(clientId), data),
    ...options,
  });
