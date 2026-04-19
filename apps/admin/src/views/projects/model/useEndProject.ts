import { post, projectQueryKeys, projectUrl } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export interface EndProjectRequest {
  projectId: number;
  endYear: number;
}

export const useEndProject = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, EndProjectRequest>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: projectQueryKeys.postProjectEndById(),
    mutationFn: ({ projectId, endYear }) =>
      post<BaseApiResponse>(projectUrl.postProjectEndById(projectId), { endYear }),
    ...options,
  });
