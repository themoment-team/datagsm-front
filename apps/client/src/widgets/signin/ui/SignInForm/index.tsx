'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

import { COOKIE_KEYS } from '@repo/shared/constants';
import { useExchangeToken } from '@repo/shared/hooks';
import { SignInFormType } from '@repo/shared/types';
import { SignInForm as SharedSignInForm } from '@repo/shared/ui';
import { setCookie } from '@repo/shared/utils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { useRequestOAuthCode } from '../../model/useRequestOAuthCode';

interface SignInFormProps {
  clientId: string | null;
  redirectUri: string | null;
}

const SignInForm = ({ clientId, redirectUri }: SignInFormProps) => {
  const router = useRouter();
  const formDataRef = useRef<SignInFormType | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isExternalOAuth = clientId !== null && redirectUri !== null;

  // 내부 OAuth용 환경 변수
  const internalClientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID!;
  const internalRedirectUri = process.env.NEXT_PUBLIC_DATAGSM_REDIRECT_URI!;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Step 3: 외부 OAuth 코드 발급 (외부 서비스로 리다이렉트용)
  const { mutate: requestExternalOAuthCode, isPending: isRequestingExternalCode } =
    useRequestOAuthCode({
      onSuccess: (response) => {
        if (redirectUri && response.data.code) {
          const redirectUrl = `${redirectUri}?code=${response.data.code}`;
          window.location.href = redirectUrl;
        }
      },
      onError: (error: unknown) => {
        const statusCode =
          error instanceof AxiosError
            ? (error.response?.data as { code?: number })?.code
            : undefined;

        switch (statusCode) {
          case 400:
            toast.error('잘못된 요청입니다. 홈으로 이동합니다.');
            break;
          case 404:
            toast.error('존재하지 않는 클라이언트입니다. 홈으로 이동합니다.');
            break;
          default:
            toast.error('OAuth 인증에 실패했습니다. 홈으로 이동합니다.');
        }

        timerRef.current = setTimeout(() => {
          router.push('/');
        }, 1500);
      },
    });

  // Step 2: Code → Token 교환
  const { mutate: exchangeToken, isPending: isExchangingToken } = useExchangeToken({
    onSuccess: (response) => {
      if (response.data.accessToken && response.data.refreshToken) {
        setCookie(COOKIE_KEYS.ACCESS_TOKEN, response.data.accessToken);
        setCookie(COOKIE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      }

      if (isExternalOAuth && clientId && redirectUri && formDataRef.current) {
        // 외부 OAuth: 다시 코드 발급 → 외부 서비스로 리다이렉트
        toast.success('로그인에 성공했습니다. 리디렉션 중...');
        timerRef.current = setTimeout(() => {
          requestExternalOAuthCode({
            email: formDataRef.current!.email,
            password: formDataRef.current!.password,
            clientId: clientId,
            redirectUrl: redirectUri,
          });
        }, 500);
      } else {
        // 내부 로그인: 홈으로
        toast.success('로그인에 성공했습니다.');
        router.push('/');
      }
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
        // 즉시 Code → Token 교환 (client_secret은 서버에서 자동으로 추가됨)
        exchangeToken({
          code: response.data.code,
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
    formDataRef.current = data;

    // 항상 내부 OAuth 코드 발급부터 시작
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
      isPending={isRequestingInternalCode || isExchangingToken || isRequestingExternalCode}
      signupHref="/signup"
    />
  );
};

export default SignInForm;
