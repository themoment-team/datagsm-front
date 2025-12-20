import { clubQueryKeys, clubUrl, del } from '@repo/shared/api';
import { BaseApiResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useDeleteClub = (
  options?: Omit<
    UseMutationOptions<BaseApiResponse, AxiosError, number>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: clubQueryKeys.deleteClubById(),
    mutationFn: (clubId) => del<BaseApiResponse>(clubUrl.deleteClubById(clubId)),
    ...options,
  });
