import { applicationQueryKeys, applicationUrl, patch } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { UpdateApplicationRequest } from '@/entities/application';

export const useUpdateApplicationName = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, { id: string; data: UpdateApplicationRequest }>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: applicationQueryKeys.patchApplication(),
    mutationFn: ({ id, data }: { id: string; data: UpdateApplicationRequest }) =>
      patch<BaseApiResponse>(applicationUrl.patchApplication(id), data),
    ...options,
  });
