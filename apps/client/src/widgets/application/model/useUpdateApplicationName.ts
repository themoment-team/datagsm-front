import { applicationQueryKeys, applicationUrl, patch } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationRequest } from '@/entities/application';

interface UpdateApplicationNameParams {
  id: string;
  data: UpdateApplicationRequest;
}

export const useUpdateApplicationName = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, UpdateApplicationNameParams>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.patchApplication(),
    mutationFn: ({ id, data }: UpdateApplicationNameParams) =>
      patch<BaseApiResponse>(applicationUrl.patchApplication(id), data),
    ...options,
  });
