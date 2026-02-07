import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { post, oauthQueryKeys, oauthUrl } from '../api';
import { OAuthTokenResponse } from '../types';

interface ExchangeTokenInput {
  code: string;
}

export const useExchangeToken = (
  options?: Omit<
    UseMutationOptions<OAuthTokenResponse, AxiosError, ExchangeTokenInput>,
    'mutationKey' | 'mutationFn'
  >,
) =>
  useMutation({
    mutationKey: oauthQueryKeys.postOAuthToken(),
    mutationFn: async (data: ExchangeTokenInput) => {
      const codeVerifier = sessionStorage.getItem('oauth_code_verifier');

      if (!codeVerifier) {
        throw new Error('PKCE code verifier not found in session storage');
      }

      const response = await post<OAuthTokenResponse>(oauthUrl.postOAuthToken(), {
        code: data.code,
        code_verifier: codeVerifier,
      });

      sessionStorage.removeItem('oauth_code_verifier');

      return response;
    },
    ...options,
  });
