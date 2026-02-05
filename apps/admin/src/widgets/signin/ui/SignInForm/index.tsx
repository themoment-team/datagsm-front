'use client';

import { useRouter } from 'next/navigation';

import { COOKIE_KEYS } from '@repo/shared/constants';
import { useExchangeToken } from '@repo/shared/hooks';
import { SignInFormType } from '@repo/shared/types';
import { SignInForm as SharedSignInForm } from '@repo/shared/ui';
import { setCookie } from '@repo/shared/utils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { useRequestOAuthCode } from '../../model/useRequestOAuthCode';

const SignInForm = () => {
  const router = useRouter();

  // 내부 OAuth용 환경 변수
  const internalClientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID!;
  const internalClientSecret = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_SECRET!;
  const internalRedirectUri = process.env.NEXT_PUBLIC_DATAGSM_REDIRECT_URI!;

  // Step 2: Code → Token 교환
  const { mutate: exchangeToken, isPending: isExchangingToken } = useExchangeToken({
    onSuccess: (response) => {
      if (response.data.accessToken && response.data.refreshToken) {
        setCookie(COOKIE_KEYS.ACCESS_TOKEN, response.data.accessToken);
        setCookie(COOKIE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }

      toast.success('로그인에 성공했습니다.');
      router.push('/students');
    },
    onError: (error: unknown) => {
      const statusCode =
        error instanceof AxiosError ? (error.response?.data as { code?: number })?.code : undefined;

      switch (statusCode) {
        case 400:
          toast.error('잘못된 인증 코드입니다.');
          break;
        case 404:
          toast.error('인증 코드가 만료되었거나 존재하지 않습니다.');
          break;
        default:
          toast.error('토큰 교환에 실패했습니다.');
      }
    },
  });

  // Step 1: 내부 OAuth 코드 발급
  const { mutate: requestInternalOAuthCode, isPending: isRequestingInternalCode } =
    useRequestOAuthCode({
      onSuccess: (response) => {
        // 즉시 Code → Token 교환
        exchangeToken({
          code: response.data.code,
          clientSecret: internalClientSecret,
        });
      },
      onError: (error: unknown) => {
        const statusCode =
          error instanceof AxiosError
            ? (error.response?.data as { code?: number })?.code
            : undefined;

        switch (statusCode) {
          case 400:
            toast.error('입력 정보를 확인해주세요.');
            break;
          case 401:
            toast.error('비밀번호가 일치하지 않습니다.');
            break;
          case 404:
            toast.error('존재하지 않는 계정입니다.');
            break;
          default:
            toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
      },
    });

  const handleSubmit = (data: SignInFormType) => {
    // 내부 OAuth 코드 발급
    requestInternalOAuthCode({
      email: data.email,
      password: data.password,
      clientId: internalClientId,
      redirectUrl: internalRedirectUri,
    });
  };

  return (
    <SharedSignInForm
      onSubmit={handleSubmit}
      isPending={isRequestingInternalCode || isExchangingToken}
    />
  );
};

export default SignInForm;
