import { studentQueryKeys, studentUrl, patch } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface PatchMyGithubIdData {
  githubId: string | null;
}

export const usePatchMyGithubId = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, PatchMyGithubIdData>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: studentQueryKeys.patchMyGithubId(),
    mutationFn: (data: PatchMyGithubIdData) =>
      patch<BaseApiResponse>(studentUrl.patchMyGithubId(), data),
    ...options,
  });
