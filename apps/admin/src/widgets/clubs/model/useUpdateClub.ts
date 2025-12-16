import { clubQueryKeys, clubUrl, put } from '@repo/shared/api';
import { ClubListResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { AddClubType } from '@/entities/club';

interface UpdateClubVariables {
  clubId: number;
  data: AddClubType;
}

export const useUpdateClub = (
  options?: Omit<
    UseMutationOptions<ClubListResponse, AxiosError, UpdateClubVariables>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: clubQueryKeys.putClubById(),
    mutationFn: ({ clubId, data }: UpdateClubVariables) =>
      put<ClubListResponse>(clubUrl.putClubById(clubId), data),
    ...options,
  });
