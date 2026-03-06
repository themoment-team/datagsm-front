import { del, projectQueryKeys, projectUrl } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteProject = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, number>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: projectQueryKeys.deleteProjectById(),
    mutationFn: (projectId) => del<BaseApiResponse>(projectUrl.deleteProjectById(projectId)),
    ...options,
  });
