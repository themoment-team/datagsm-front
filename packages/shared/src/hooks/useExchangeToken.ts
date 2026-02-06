import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { post, oauthQueryKeys, oauthUrl } from '../api';
import { OAuthTokenRequest, OAuthTokenResponse } from '../types';

export const useExchangeToken = (
  options?: Omit<
    UseMutationOptions<OAuthTokenResponse, AxiosError, OAuthTokenRequest>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: oauthQueryKeys.postOAuthToken(),
    mutationFn: (data: OAuthTokenRequest) =>
      post<OAuthTokenResponse>(oauthUrl.postOAuthToken(), data),
    ...options,
  });
