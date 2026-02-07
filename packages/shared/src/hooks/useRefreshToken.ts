import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { oauthPost, oauthQueryKeys, oauthUrl } from '../api';
import { RefreshTokenRequest, RefreshTokenResponse } from '../types';

export const useRefreshToken = (
  options?: Omit<
    UseMutationOptions<RefreshTokenResponse, AxiosError, RefreshTokenRequest>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: oauthQueryKeys.postOAuthTokens(),
    mutationFn: (data: RefreshTokenRequest) =>
      oauthPost<RefreshTokenResponse>(oauthUrl.postOAuthTokens(), data),
    ...options,
  });
