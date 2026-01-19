import { oauthPost, oauthQueryKeys, oauthUrl } from '@repo/shared/api';
import { OAuthCodeRequest, OAuthCodeResponse } from '@repo/shared/types';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const useRequestOAuthCode = (
  options?: UseMutationOptions<OAuthCodeResponse, AxiosError, OAuthCodeRequest>,
) =>
  useMutation({
    mutationKey: oauthQueryKeys.postOAuthCode(),
    mutationFn: (data: OAuthCodeRequest) =>
      oauthPost<OAuthCodeResponse>(oauthUrl.postOAuthCode(), data),
    ...options,
  });
