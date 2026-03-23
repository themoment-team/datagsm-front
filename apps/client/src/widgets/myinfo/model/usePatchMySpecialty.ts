import { studentQueryKeys, studentUrl, patch } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

interface PatchMySpecialtyData {
  specialty: string | null;
}

export const usePatchMySpecialty = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, PatchMySpecialtyData>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: studentQueryKeys.patchMySpecialty(),
    mutationFn: (data: PatchMySpecialtyData) =>
      patch<BaseApiResponse>(studentUrl.patchMySpecialty(), data),
    ...options,
  });
