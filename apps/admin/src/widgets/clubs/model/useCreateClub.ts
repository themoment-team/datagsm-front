import { clubQueryKeys, clubUrl, post } from '@repo/shared/api';
import { ClubListResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { AddClubType } from '@/entities/club';

export const useCreateClub = (
  options?: Omit<
    UseMutationOptions<ClubListResponse, AxiosError, AddClubType>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: clubQueryKeys.postClub(),
    mutationFn: (data: AddClubType) => post<ClubListResponse>(clubUrl.postClub(), data),
    ...options,
  });
