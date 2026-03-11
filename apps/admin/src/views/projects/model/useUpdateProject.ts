import { projectQueryKeys, projectUrl, put } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { AddProjectType } from '@/entities/project';

export interface UpdateProjectRequest {
  projectId: number;
  data: AddProjectType;
}

export const useUpdateProject = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, UpdateProjectRequest>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: projectQueryKeys.putProjectById(),
    mutationFn: ({ projectId, data }) =>
      put<BaseApiResponse>(projectUrl.putProjectById(projectId), data),
    ...options,
  });
