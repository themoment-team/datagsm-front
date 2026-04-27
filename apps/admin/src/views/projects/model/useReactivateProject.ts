import { post, projectQueryKeys, projectUrl } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useReactivateProject = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, number>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: projectQueryKeys.postProjectReactivateById(),
    mutationFn: (projectId) => post<BaseApiResponse>(projectUrl.postProjectReactivateById(projectId)),
    ...options,
  });
