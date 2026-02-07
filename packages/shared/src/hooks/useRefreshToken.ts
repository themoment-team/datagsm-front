import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { oauthPost, oauthQueryKeys, oauthUrl } from '../api';
import { RefreshTokenResponse } from '../types';

interface RefreshTokenInput {
  refreshToken: string;
}

export const useRefreshToken = (
  options?: Omit<
    UseMutationOptions<RefreshTokenResponse, AxiosError, RefreshTokenInput>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: oauthQueryKeys.postOAuthTokenRefresh(),
    mutationFn: (data: RefreshTokenInput) =>
      oauthPost<RefreshTokenResponse>(oauthUrl.postOAuthTokenRefresh(), {
        grant_type: 'refresh_token',
        refresh_token: data.refreshToken,
      }),
    ...options,
  });
